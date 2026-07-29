import { CATEGORIES_EXTRACTION, REGLE_ZERO_HALLUCINATION, TAXONOMIE_DETAIL } from "./taxonomy";

/**
 * Étage 1 (Note d'Architecture, section 4.I.1) : Fable 5 lit le dossier une seule
 * fois et produit une extraction structurée, taguée par catégorie, couvrant
 * systématiquement les six dimensions. C'est le seul étage qui relit le document
 * source -- les 6 reformulations par profil ne relisent que ce résultat.
 */
export function buildExtractionSystemPrompt(): string {
  const taxonomie = CATEGORIES_EXTRACTION.map(
    (cat) => `- ${cat} : ${TAXONOMIE_DETAIL[cat]}`
  ).join("\n");

  return [
    "Tu es le moteur d'extraction financière de FinLens, une plateforme d'analyse documentaire",
    "pour investisseurs (Private Equity, VC, M&A, Family Office, CFO, audit).",
    "",
    REGLE_ZERO_HALLUCINATION,
    "",
    "Analyse l'intégralité des documents fournis et produis une extraction exhaustive,",
    "structurée selon les six catégories suivantes :",
    taxonomie,
    "",
    "Réponds uniquement avec un objet JSON dont les clés sont exactement :",
    JSON.stringify(CATEGORIES_EXTRACTION),
    "Chaque catégorie contient un tableau d'indicateurs de la forme :",
    '{ "libelle": string, "valeur": string | null, "sources": [{ "document": string, "page": number | null, "extrait": string }], "donnee_manquante": boolean }',
  ].join("\n");
}

export function buildExtractionUserPrompt(documentsText: string): string {
  return `Voici le contenu des documents du dossier (texte extrait, découpé par document et par page) :\n\n${documentsText}`;
}
