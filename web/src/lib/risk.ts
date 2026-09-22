import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums } from "@/types/database";

/**
 * Le score de risque est propre à chaque (dossier, profil) — cinq axes
 * pondérés différemment selon l'angle de lecture (Note de fonctionnement,
 * §9.2). `dossiers.risk_score` n'est donc jamais tenu à jour directement ;
 * les écrans de liste (une ligne par dossier, pas de profil sélectionné)
 * affichent le score du profil actuellement actif, résolu ici.
 */
export async function resoudreScoresRisque(
  supabase: SupabaseClient<Database>,
  dossiers: { id: string; active_profil: Enums<"profil_analyse"> }[]
): Promise<Map<string, number | null>> {
  const scores = new Map<string, number | null>();
  if (dossiers.length === 0) return scores;

  const { data: notes } = await supabase
    .from("notes_profils")
    .select("dossier_id, profil, risk_score")
    .in(
      "dossier_id",
      dossiers.map((d) => d.id)
    );

  for (const dossier of dossiers) {
    const note = (notes ?? []).find((n) => n.dossier_id === dossier.id && n.profil === dossier.active_profil);
    scores.set(dossier.id, note?.risk_score ?? null);
  }

  return scores;
}
