import { extractText, getDocumentProxy } from "unpdf";

export type PageText = { page: number; text: string };

export async function extractPdfPages(fileBuffer: ArrayBuffer): Promise<PageText[]> {
  const pdf = await getDocumentProxy(new Uint8Array(fileBuffer));
  const { text } = await extractText(pdf, { mergePages: false });

  return text.map((pageText, index) => ({ page: index + 1, text: pageText }));
}

/** ~1500 pages / 1M tokens (Note d'Architecture, section E) -> seuil de bascule map-reduce. */
export const SEUIL_PAGES_MAP_REDUCE = 1500;
