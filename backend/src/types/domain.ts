import type { CategorieExtraction } from "@/lib/ai/prompts/taxonomy";

export type SourceCitation = {
  document: string;
  page: number | null;
  extrait: string;
};

export type IndicateurExtrait = {
  libelle: string;
  valeur: string | null;
  sources: SourceCitation[];
  donnee_manquante: boolean;
};

/** Sortie de l'étage 1 (extraction exhaustive Fable 5) -- une par dossier. */
export type ExtractionContenu = Record<CategorieExtraction, IndicateurExtrait[]>;

/** Sortie de l'étage 2 (reformulation par profil, Sonnet 5) -- une par profil et par dossier. */
export type NoteProfilContenu = {
  resume_court: string;
  score_risque: number;
  axes_risque: { axe: string; poids: number; commentaire: string }[];
  indicateurs_cles: IndicateurExtrait[];
  note_complete: { section: string; contenu: string }[];
};

export type ChatReponse = {
  reponse: string;
  sources: SourceCitation[];
  complexite: "standard" | "complexe";
};

export type ComparaisonContenu = {
  lignes: { indicateur: string; valeurs: Record<string, string>; sources: SourceCitation[] }[];
  synthese: string;
};

export type ContradictionDetectee = {
  gravite: "critique" | "a_verifier" | "mineur";
  description: string;
  source_a: SourceCitation;
  source_b: SourceCitation;
};
