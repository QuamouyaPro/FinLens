import type { Enums } from "@/types/database";

type ProfilAnalyse = Enums<"profil_analyse">;

/** Les 6 profils métier + le profil Personnalisé (Note explicative, section 9.1). */
export const PROFIL_LABELS: Record<ProfilAnalyse, string> = {
  pe_vc: "Private Equity / Venture Capital",
  ma: "M&A / Banque d'affaires",
  family_office: "Analyste indépendant / Family Office",
  cfo: "CFO / Direction financière",
  audit_conseil: "Audit & Conseil financier",
  generaliste: "Généraliste / Étudiant",
  personnalise: "Personnalisé",
};

export const PROFIL_ANGLE: Record<ProfilAnalyse, string> = {
  pe_vc: "thèse d'investissement, effet de levier, trajectoire de croissance, multiples de valorisation",
  ma: "structuration de la transaction, synergies, clauses contractuelles, risques juridiques",
  family_office: "solidité patrimoniale, diversification, préservation du capital long terme",
  cfo: "veille concurrentielle, benchmark sectoriel, positionnement face aux pairs",
  audit_conseil: "conformité, provisions, incohérences comptables, zones de risque à documenter",
  generaliste: "résumé pédagogique, vulgarisé, sans jargon technique, glossaire intégré",
  personnalise: "analyse complète neutre, sans priorité métier, axée sur les indicateurs choisis par l'utilisateur",
};

/** Profils disponibles sur l'offre Essentiel (Note explicative, section 10). */
export const PROFILS_ESSENTIEL: ProfilAnalyse[] = ["generaliste", "cfo", "family_office"];
export const PROFILS_TOUTES_OFFRES: ProfilAnalyse[] = [
  "pe_vc",
  "ma",
  "family_office",
  "cfo",
  "audit_conseil",
  "generaliste",
  "personnalise",
];

/**
 * Étage 2 (Note d'Architecture, section 4.I.1) : Sonnet 5 relit uniquement
 * l'extraction déjà produite (pas le document source) et reformule selon l'angle
 * du profil. Aucun nouveau raisonnement sur le document brut à ce stade.
 */
export function buildReformulationSystemPrompt(profil: ProfilAnalyse, indicateursPersonnalises?: string[]): string {
  const angle =
    profil === "personnalise" && indicateursPersonnalises?.length
      ? `${PROFIL_ANGLE.personnalise}. Indicateurs sélectionnés par l'utilisateur : ${indicateursPersonnalises.join(", ")}.`
      : PROFIL_ANGLE[profil];

  return [
    `Tu rédiges la note d'analyse FinLens pour le profil "${PROFIL_LABELS[profil]}".`,
    `Angle de lecture attendu : ${angle}.`,
    "",
    "Tu ne dois PAS relire les documents sources : base-toi uniquement sur l'extraction JSON",
    "fournie ci-dessous (déjà produite par le moteur d'analyse principal). Ta tâche est de",
    "sélectionner, réordonner et pondérer ces informations selon l'angle du profil -- pas de",
    "produire un nouveau raisonnement sur le document brut. Conserve toutes les citations sources",
    "telles quelles.",
    "",
    "Réponds uniquement avec un objet JSON de la forme :",
    JSON.stringify({
      resume_court: "string",
      score_risque: "number (0-100)",
      axes_risque: [{ axe: "string", poids: "number", commentaire: "string" }],
      indicateurs_cles: "IndicateurExtrait[] (6 max)",
      note_complete: [{ section: "string", contenu: "string" }],
    }),
  ].join("\n");
}

export function buildReformulationUserPrompt(extractionJson: string): string {
  return `Extraction source (étage 1) :\n\n${extractionJson}`;
}
