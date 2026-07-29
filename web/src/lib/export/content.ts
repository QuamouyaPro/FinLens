import type { NoteProfilContenu } from "@/types/domain";
import { PROFIL_LABELS } from "@/lib/ai/prompts/profils";
import type { Enums } from "@/types/database";

type ProfilAnalyse = Enums<"profil_analyse">;

export type AjoutCopilote = {
  categorie: string;
  contenu: string;
};

export type ExportContent = {
  titre: string;
  profilLabel: string;
  resumeCourt: string;
  scoreRisque: number;
  indicateursCles: { libelle: string; valeur: string | null }[];
  sections: { section: string; contenu: string }[];
  ajoutsParCategorie: Map<string, string[]>;
};

/**
 * Fusionne la note générée (étage 2) avec les ajouts épinglés depuis le Copilote
 * (Note d'Architecture, I.3/I.4) -- ces derniers apparaissent dans l'export,
 * classés par catégorie, sans nouvel appel IA.
 */
export function buildExportContent(
  dossierName: string,
  profil: ProfilAnalyse,
  note: NoteProfilContenu,
  ajouts: AjoutCopilote[]
): ExportContent {
  const ajoutsParCategorie = new Map<string, string[]>();
  for (const ajout of ajouts) {
    const list = ajoutsParCategorie.get(ajout.categorie) ?? [];
    list.push(ajout.contenu);
    ajoutsParCategorie.set(ajout.categorie, list);
  }

  return {
    titre: dossierName,
    profilLabel: PROFIL_LABELS[profil],
    resumeCourt: note.resume_court,
    scoreRisque: note.score_risque,
    indicateursCles: note.indicateurs_cles.map((i) => ({ libelle: i.libelle, valeur: i.valeur })),
    sections: note.note_complete,
    ajoutsParCategorie,
  };
}
