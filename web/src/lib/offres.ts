import type { Enums } from "@/types/database";

type Offre = Enums<"offre">;
type ProfilAnalyse = Enums<"profil_analyse">;

/** Grille tarifaire (Coûts & Pricing, section 7). */
export const OFFRES = {
  essentiel: {
    label: "Essentiel",
    prixMensuel: 23,
    dossiersActifsMax: 4,
    dossiersAnalysesParMois: 3,
    questionsParMois: 100,
    comparateur: false,
    equipe: false,
  },
  analyste: {
    label: "Analyste",
    prixMensuel: 690,
    dossiersActifsMax: 15,
    dossiersAnalysesParMois: null,
    questionsParMois: null,
    comparateur: true,
    equipe: false,
  },
  fonds: {
    label: "Fonds",
    prixMensuel: 2900,
    dossiersActifsMax: 15,
    dossiersAnalysesParMois: null,
    questionsParMois: null,
    comparateur: true,
    equipe: true,
  },
} as const satisfies Record<Offre, unknown>;

/** Les 3 profils inclus dans Essentiel (Note d'Architecture, 4.I.1). */
export const PROFILS_ESSENTIEL: ProfilAnalyse[] = ["generaliste", "cfo", "family_office"];

export const PROFILS_ORDRE: ProfilAnalyse[] = [
  "pe_vc",
  "ma",
  "family_office",
  "cfo",
  "audit_conseil",
  "generaliste",
  "personnalise",
];

export const PROFIL_LABELS: Record<ProfilAnalyse, string> = {
  pe_vc: "Private Equity / Venture Capital",
  ma: "M&A / Banque d'affaires",
  family_office: "Analyste indépendant / Family Office",
  cfo: "CFO / Direction financière",
  audit_conseil: "Audit & Conseil financier",
  generaliste: "Généraliste / Étudiant",
  personnalise: "Personnalisé",
};

export const PROFIL_LABELS_COURTS: Record<ProfilAnalyse, string> = {
  pe_vc: "PE / VC",
  ma: "M&A",
  family_office: "Family Office",
  cfo: "CFO",
  audit_conseil: "Audit",
  generaliste: "Généraliste",
  personnalise: "Personnalisé",
};

export const PROFIL_ANGLES: Record<ProfilAnalyse, string> = {
  pe_vc: "Thèse d'investissement, effet de levier, trajectoire de croissance, multiples",
  ma: "Structuration de la transaction, synergies, clauses, risques juridiques",
  family_office: "Solidité patrimoniale, diversification, préservation du capital",
  cfo: "Veille concurrentielle, benchmark sectoriel, positionnement face aux pairs",
  audit_conseil: "Conformité, provisions, incohérences comptables, zones de risque",
  generaliste: "Résumé pédagogique, vulgarisé, sans jargon technique",
  personnalise: "Indicateurs choisis librement, analyse complète neutre en dessous",
};

export function profilDisponible(offre: Offre, profil: ProfilAnalyse): boolean {
  if (offre === "essentiel") return PROFILS_ESSENTIEL.includes(profil);
  return true;
}

export const TYPES_OPERATION: Record<Enums<"type_operation">, string> = {
  due_diligence: "Due diligence",
  lbo: "LBO",
  serie_a_b: "Série A / B",
  screening: "Screening",
  veille: "Veille",
};

/** Catégories de la taxonomie d'extraction (Note d'Architecture, 4.I.1). */
export const CATEGORIES_LABELS: Record<string, string> = {
  financier: "Financier",
  juridique: "Juridique & structuration",
  concurrentiel: "Concurrentiel & marché",
  esg: "ESG",
  gouvernance: "Gouvernance & équipe",
  risques: "Risques & signaux faibles",
};

export function niveauRisque(score: number | null): "lo" | "md" | "hi" {
  if (score === null) return "lo";
  if (score >= 60) return "hi";
  if (score >= 35) return "md";
  return "lo";
}

export function libelleRisque(score: number | null): string {
  if (score === null) return "Non évalué";
  const n = niveauRisque(score);
  return n === "hi" ? "Risque élevé" : n === "md" ? "À surveiller" : "Risque maîtrisé";
}
