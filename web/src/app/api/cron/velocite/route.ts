import { NextRequest, NextResponse } from "next/server";
import { assertCronAuthorized } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Détection de vélocité anormale (Note d'Architecture, section G) : déclenche
 * une alerte pour revue humaine, jamais un blocage automatique -- sauf schéma
 * clairement non-humain (rafale de requêtes en quelques secondes, is_burst),
 * qui déclenche un throttling immédiat le temps qu'une vérification ait lieu.
 * À planifier toutes les 15-30 minutes (Vercel Cron / scheduler externe).
 */
async function handler(request: NextRequest) {
  const unauthorized = assertCronAuthorized(request);
  if (unauthorized) return unauthorized;

  const admin = getSupabaseAdmin();

  const { data: anomalies, error } = await admin.rpc("detect_velocity_anomalies");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let inserted = 0;
  for (const anomaly of anomalies ?? []) {
    // Évite les doublons : une alerte ouverte déjà existante pour ce couple
    // (organisation, utilisateur, métrique) sur la dernière heure n'est pas recréée.
    const { data: existing } = await admin
      .from("velocity_alerts")
      .select("id")
      .eq("organization_id", anomaly.organization_id)
      .eq("user_id", anomaly.user_id)
      .eq("metric", anomaly.metric)
      .eq("status", "ouverte")
      .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .maybeSingle();

    if (existing) continue;

    await admin.from("velocity_alerts").insert({
      organization_id: anomaly.organization_id,
      user_id: anomaly.user_id,
      metric: anomaly.metric,
      observed_value: anomaly.observed_value,
      baseline_value: anomaly.baseline_value,
      status: anomaly.is_burst ? "throttled" : "ouverte",
    });
    inserted++;
  }

  return NextResponse.json({ anomalies_detected: anomalies?.length ?? 0, alerts_created: inserted });
}

export const GET = handler;
export const POST = handler;
