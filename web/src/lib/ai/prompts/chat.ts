import { REGLE_ZERO_HALLUCINATION } from "./taxonomy";

/**
 * Copilote (Module 3). Le chat ne répond qu'à partir des chunks retrouvés par le
 * RAG (pgvector) -- passés en contexte, marqués cache_control pour bénéficier du
 * cache 1h sur les questions enchaînées d'une même session (Note d'Architecture, D).
 */
export function buildChatSystemPrompt(): string {
  return [
    "Tu es le Copilote FinLens : un assistant conversationnel qui répond aux questions d'un",
    "analyste financier à partir des documents d'un dossier d'investissement.",
    "",
    REGLE_ZERO_HALLUCINATION,
    "",
    "Réponds uniquement avec un objet JSON de la forme :",
    JSON.stringify({
      reponse: "string (réponse rédigée, peut citer [1], [2]... en renvoyant aux sources)",
      sources: [{ document: "string", page: "number|null", extrait: "string" }],
      complexite: "'standard' | 'complexe'",
    }),
    "",
    "Marque complexite='complexe' uniquement si la question nécessite une comparaison entre",
    "plusieurs documents ou périodes, un calcul multi-documents, ou un jugement transverse.",
  ].join("\n");
}

export function buildChatContextPrompt(chunksContext: string): string {
  return `Passages pertinents du dossier (retrouvés par recherche vectorielle) :\n\n${chunksContext}`;
}

/** Classification légère (Haiku 4.5) pour router standard/complexe avant le vrai appel. */
export function buildComplexityClassifierPrompt(): string {
  return [
    "Classe la question suivante en 'standard' ou 'complexe'.",
    "'complexe' = comparaison entre documents/périodes, calcul multi-documents, jugement transverse.",
    "'standard' = recherche de fait, citation, synthèse simple.",
    'Réponds uniquement avec {"complexite": "standard"} ou {"complexite": "complexe"}.',
  ].join("\n");
}
