/** Extrait un objet JSON d'une réponse modèle, même si elle est entourée de ```json ... ```. */
export function parseJsonResponse<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;

  try {
    return JSON.parse(raw.trim()) as T;
  } catch (error) {
    throw new Error(
      `Réponse modèle non JSON valide : ${(error as Error).message}\n---\n${text.slice(0, 500)}`
    );
  }
}
