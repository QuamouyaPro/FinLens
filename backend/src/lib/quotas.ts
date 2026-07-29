import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const CAP_DOSSIERS_OUVERTS = 15; // Analyste / Fonds, par siège (Note explicative, section 10)
const ESSENTIEL_DOSSIERS_LIMIT = 3;
const ESSENTIEL_QUESTIONS_LIMIT = 100;

export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExceededError";
  }
}

/**
 * Plafond de 15 dossiers actifs simultanément, par utilisateur (siège), sur
 * Analyste et Fonds -- seule limite visible du produit, sans impact sur le
 * volume total traitable (Note d'Architecture, section F).
 */
export async function assertDossierCapNotReached(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  ownerId: string
) {
  const { data: org } = await supabase
    .from("organizations")
    .select("offre")
    .eq("id", organizationId)
    .single();

  if (org?.offre === "essentiel") return; // plafond Essentiel = dossiers actifs (4), géré séparément

  const { count } = await supabase
    .from("dossiers")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("owner_id", ownerId)
    .eq("status", "actif");

  if ((count ?? 0) >= CAP_DOSSIERS_OUVERTS) {
    throw new QuotaExceededError(
      `Plafond de ${CAP_DOSSIERS_OUVERTS} dossiers ouverts simultanément atteint. Archivez un dossier pour en ouvrir un nouveau.`
    );
  }
}

const ESSENTIEL_ACTIFS_LIMIT = 4;

export async function assertEssentielActifsCapNotReached(
  supabase: SupabaseClient<Database>,
  organizationId: string
) {
  const { count } = await supabase
    .from("dossiers")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("status", "actif");

  if ((count ?? 0) >= ESSENTIEL_ACTIFS_LIMIT) {
    throw new QuotaExceededError(
      `Offre Essentiel : ${ESSENTIEL_ACTIFS_LIMIT} dossiers actifs maximum. Archivez un dossier pour en ouvrir un nouveau.`
    );
  }
}

/** Récupère (ou crée) le cycle de quota en cours pour une organisation Essentiel. */
export async function getOrCreateCurrentQuotaCycle(
  supabase: SupabaseClient<Database>,
  organizationId: string
) {
  const { data: existing } = await supabase
    .from("quotas_essentiel")
    .select("*")
    .eq("organization_id", organizationId)
    .lte("cycle_start", new Date().toISOString())
    .gt("cycle_end", new Date().toISOString())
    .maybeSingle();

  if (existing) return existing;

  const now = new Date();
  const cycleEnd = new Date(now);
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);

  const { data: created, error } = await supabase
    .from("quotas_essentiel")
    .insert({
      organization_id: organizationId,
      cycle_start: now.toISOString(),
      cycle_end: cycleEnd.toISOString(),
      dossiers_analyses_limit: ESSENTIEL_DOSSIERS_LIMIT,
      questions_limit: ESSENTIEL_QUESTIONS_LIMIT,
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export async function assertQuotaAndIncrement(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  kind: "dossier_analyse" | "question"
) {
  const cycle = await getOrCreateCurrentQuotaCycle(supabase, organizationId);

  if (cycle.blocked) {
    throw new QuotaExceededError(
      "Quota mensuel Essentiel atteint. L'accès à de nouvelles analyses/questions est bloqué jusqu'au prochain prélèvement."
    );
  }

  const field = kind === "dossier_analyse" ? "dossiers_analyses_count" : "questions_count";
  const limitField = kind === "dossier_analyse" ? "dossiers_analyses_limit" : "questions_limit";
  const nextValue = cycle[field] + 1;

  if (nextValue > cycle[limitField]) {
    await supabase.from("quotas_essentiel").update({ blocked: true }).eq("id", cycle.id);
    throw new QuotaExceededError(
      "Quota mensuel Essentiel atteint. L'accès à de nouvelles analyses/questions est bloqué jusqu'au prochain prélèvement."
    );
  }

  const update = kind === "dossier_analyse" ? { dossiers_analyses_count: nextValue } : { questions_count: nextValue };
  await supabase.from("quotas_essentiel").update(update).eq("id", cycle.id);
}
