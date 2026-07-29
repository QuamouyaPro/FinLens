import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export class ThrottledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThrottledError";
  }
}

const BURST_WINDOW_SECONDS = 60;
const BURST_MAX_QUESTIONS = 15;

/**
 * Throttling synchrone contre les rafales de requêtes (schéma clairement
 * non-humain -- Note d'Architecture, section G). Le cron /api/cron/velocite
 * ne tourne plus qu'une fois par jour (limite du plan Vercel Hobby, cron jobs
 * limités à une exécution quotidienne) : il ne peut plus détecter un burst en
 * quasi temps réel, donc ce contrôle synchrone est la vraie protection contre
 * les scripts/comptes partagés, indépendante de la fréquence du cron.
 */
export async function assertNotBursting(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  userId: string
) {
  const since = new Date(Date.now() - BURST_WINDOW_SECONDS * 1000).toISOString();

  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .gt("created_at", since);

  if ((count ?? 0) >= BURST_MAX_QUESTIONS) {
    const admin = getSupabaseAdmin();
    await admin.from("velocity_alerts").insert({
      organization_id: organizationId,
      user_id: userId,
      metric: "questions_par_minute_burst",
      observed_value: count ?? 0,
      baseline_value: BURST_MAX_QUESTIONS,
      status: "throttled",
    });

    throw new ThrottledError(
      "Trop de questions envoyées en peu de temps. Merci de patienter quelques instants avant de réessayer."
    );
  }
}
