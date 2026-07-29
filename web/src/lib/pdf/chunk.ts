import type { PageText } from "./extract";

export type Chunk = { page: number; chunkIndex: number; content: string };

const CHUNK_SIZE_CHARS = 3000;
const CHUNK_OVERLAP_CHARS = 300;

/** Découpe le texte de chaque page en chunks pour l'indexation vectorielle (RAG). */
export function chunkPages(pages: PageText[]): Chunk[] {
  const chunks: Chunk[] = [];
  let globalIndex = 0;

  for (const page of pages) {
    const text = page.text.trim();
    if (!text) continue;

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + CHUNK_SIZE_CHARS, text.length);
      chunks.push({ page: page.page, chunkIndex: globalIndex++, content: text.slice(start, end) });
      if (end === text.length) break;
      start = end - CHUNK_OVERLAP_CHARS;
    }
  }

  return chunks;
}

/** Concatène les pages en un seul texte, annoté par page, pour les appels d'extraction/comparaison. */
export function pagesToAnnotatedText(documentName: string, pages: PageText[]): string {
  return pages
    .map((p) => `[Document: ${documentName} | Page ${p.page}]\n${p.text}`)
    .join("\n\n");
}
