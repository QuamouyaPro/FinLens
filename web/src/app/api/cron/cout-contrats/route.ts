import { NextRequest, NextResponse } from "next/server";
import { assertCronAuthorized } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const SIEGE_PRICE_EUR = 580;
const SIEGE_PRICE_PALIER_EUR = 630;
const SIEGES_INCLUS_AVANT_PALIER = 10;

function estimateMonthlyInvoiceEur(seatsIncluded: number): number {
  const withinPalier = Math.min(seatsIncluded, SIEGES_INCLUS_AVANT_PALIER);
  const beyondPalier = Math.max(seatsIncluded - SIEGES_INCLUS_AVANT_PALIER, 0);
  return withinPalier * SIEGE_PRICE_EUR + beyondPalier * SIEGE_PRICE_PALIER_EUR;
}

/**
 * Suivi du coût réel cumulé par contrat, gros comptes Fonds (Coûts & Pricing,
 * section 9) : le risque d'usage extrême y est moins dilué que sur des clients
 * distincts (plusieurs sièges d'une même équipe intensifient leur usage
 * ensemble). Calcule le ratio coût réel / facture pour le cycle en cours et
 * flague une renégociation si > 100% sur 2 cycles consécutifs. À planifier
 * quotidiennement.
 */
async function handler(request: NextRequest) {
  const unauthorized = assertCronAuthorized(request);
  if (unauthorized) return unauthorized;

  const admin = getSupabaseAdmin();

  const { data: fondsOrgs, error } = await admin
    .from("organizations")
    .select("id, seats_included")
    .eq("offre", "fonds");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  const cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const results: { organization_id: string; ratio: number; renegotiation_flagged: boolean }[] = [];

  for (const org of fondsOrgs ?? []) {
    const { data: usage } = await admin
      .from("usage_logs")
      .select("cost_usd")
      .eq("organization_id", org.id)
      .gte("created_at", cycleStart.toISOString())
      .lt("created_at", cycleEnd.toISOString());

    const realCostUsd = (usage ?? []).reduce((sum, row) => sum + Number(row.cost_usd), 0);
    const invoicedAmountEur = estimateMonthlyInvoiceEur(org.seats_included);

    const { data: previousCycles } = await admin
      .from("contract_cost_tracking")
      .select("ratio")
      .eq("organization_id", org.id)
      .order("cycle_start", { ascending: false })
      .limit(1);

    const previousRatioOver1 = (previousCycles?.[0]?.ratio ?? 0) > 1;
    const currentRatio = invoicedAmountEur > 0 ? realCostUsd / invoicedAmountEur : 0;
    const renegotiationFlagged = previousRatioOver1 && currentRatio > 1;

    const { error: upsertError } = await admin.from("contract_cost_tracking").upsert(
      {
        organization_id: org.id,
        cycle_start: cycleStart.toISOString(),
        cycle_end: cycleEnd.toISOString(),
        invoiced_amount_eur: invoicedAmountEur,
        real_cost_usd: realCostUsd,
        renegotiation_flagged: renegotiationFlagged,
      },
      { onConflict: "organization_id,cycle_start" }
    );

    if (!upsertError) {
      results.push({ organization_id: org.id, ratio: currentRatio, renegotiation_flagged: renegotiationFlagged });
    }
  }

  return NextResponse.json({ contracts_processed: results.length, results });
}

export const GET = handler;
export const POST = handler;
