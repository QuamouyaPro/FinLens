/**
 * L'API Anthropic ne fournit pas de modèle d'embeddings : Voyage AI est le
 * fournisseur qu'Anthropic recommande pour le RAG (voyageai.com). Utilisé ici
 * uniquement pour vectoriser les chunks de documents (pgvector), jamais pour
 * le raisonnement produit -- qui reste toujours Fable 5 / Sonnet 5 / Haiku 4.5.
 */
const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const EMBEDDING_MODEL = process.env.VOYAGE_EMBEDDING_MODEL || "voyage-3-large";
export const EMBEDDING_DIMENSIONS = 1536;

export async function embedTexts(texts: string[], inputType: "document" | "query"): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error("VOYAGE_API_KEY doit être défini (voir .env.example).");
  }

  const response = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: EMBEDDING_MODEL,
      input_type: inputType,
      output_dimension: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    throw new Error(`Échec de l'appel d'embeddings Voyage AI : ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { data: { embedding: number[] }[] };
  return data.data.map((item) => item.embedding);
}

export function embeddingToSqlVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
