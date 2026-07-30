import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError } from "@/lib/api-context";
import { embedTexts } from "@/lib/ai/embeddings";

const searchSchema = z.object({
  question: z.string().min(2).max(500),
});

/**
 * Recherche globale (Note de fonctionnement, section 12) : une question posée
 * simultanément à tous les dossiers actifs. Retourne les passages avec leur
 * dossier d'origine, le document et la page — pas de génération IA ici, c'est
 * de la recherche pure (aucun appel Fable 5 / Sonnet 5, donc aucun coût).
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase } = await requireAuthContext();
    const { question } = searchSchema.parse(await request.json());

    const [queryEmbedding] = await embedTexts([question], "query");

    const { data, error } = await supabase.rpc("search_all_dossiers", {
      p_query_embedding: `[${queryEmbedding.join(",")}]`,
      p_match_count: 12,
    });
    if (error) throw error;

    return NextResponse.json({ resultats: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}
