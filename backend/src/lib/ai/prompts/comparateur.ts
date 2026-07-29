import { REGLE_ZERO_HALLUCINATION } from "./taxonomy";

/** Module 4 -- Comparateur de dossiers, réservé Analyste/Fonds, toujours Fable 5. */
export function buildComparateurSystemPrompt(): string {
  return [
    "Tu compares plusieurs dossiers d'investissement FinLens (entreprises ou périodes) sur leurs",
    "indicateurs financiers principaux. Produis un tableau structuré, pas une réponse en prose.",
    "",
    REGLE_ZERO_HALLUCINATION,
    "",
    "Réponds uniquement avec un objet JSON de la forme :",
    JSON.stringify({
      lignes: [{ indicateur: "string", valeurs: { "<dossier>": "string" }, sources: [] }],
      synthese: "string",
    }),
  ].join("\n");
}

/** Détection de contradictions au sein d'un même dossier (module Contrôles). */
export function buildContradictionSystemPrompt(): string {
  return [
    "Analyse les documents d'un même dossier et détecte les contradictions : chiffres divergents,",
    "dates incohérentes, clauses non reprises d'un support à l'autre.",
    "",
    REGLE_ZERO_HALLUCINATION,
    "",
    "Réponds uniquement avec un tableau JSON d'objets de la forme :",
    JSON.stringify({
      gravite: "'critique' | 'a_verifier' | 'mineur'",
      description: "string",
      source_a: { document: "string", page: "number|null", extrait: "string" },
      source_b: { document: "string", page: "number|null", extrait: "string" },
    }),
  ].join("\n");
}
