import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { assertQuotaAndIncrement } from "@/lib/quotas";
import { assertNotBursting } from "@/lib/velocity";
import { runChatMessage } from "@/lib/ai/router";
import { embedTexts } from "@/lib/ai/embeddings";

const chatSchema = z.object({
  dossier_id: z.string().uuid(),
  question: z.string().min(1).max(4000),
});

const CACHE_TTL_MS = 60 * 60 * 1000; // palier 1h (Note d'Architecture, section D)

/**
 * Copilote (Module 3) : classification Haiku 4.5 -> routage Sonnet 5 (standard) /
 * Fable 5 (complexe), contexte retrouvé par recherche vectorielle (RAG), citations
 * sourcées systématiques (zéro hallucination).
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, organizationId } = await requireAuthContext();
    const { dossier_id, question } = chatSchema.parse(await request.json());

    await assertNotBursting(supabase, organizationId, user.id);

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("id")
      .eq("id", dossier_id)
      .eq("organization_id", organizationId)
      .single();
    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    const { data: org } = await supabase
      .from("organizations")
      .select("offre")
      .eq("id", organizationId)
      .single();
    if (org?.offre === "essentiel") {
      await assertQuotaAndIncrement(supabase, organizationId, "question");
    }

    const { data: lastMessage } = await supabase
      .from("chat_messages")
      .select("created_at")
      .eq("dossier_id", dossier_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const cacheExpired = !lastMessage || Date.now() - new Date(lastMessage.created_at).getTime() > CACHE_TTL_MS;

    const [questionEmbedding] = await embedTexts([question], "query");
    const { data: matches, error: matchError } = await supabase.rpc("match_document_chunks", {
      p_dossier_id: dossier_id,
      p_query_embedding: `[${questionEmbedding.join(",")}]`,
      p_match_count: 8,
    });
    if (matchError) throw matchError;

    const chunksContext = (matches ?? [])
      .map((m: { document_id: string; page_number: number | null; content: string }) =>
        `[Document ${m.document_id} | Page ${m.page_number ?? "?"}]\n${m.content}`
      )
      .join("\n\n");

    await supabase.from("chat_messages").insert({
      dossier_id,
      organization_id: organizationId,
      user_id: user.id,
      role: "user",
      content: question,
    });

    const result = await runChatMessage({
      organizationId,
      userId: user.id,
      dossierId: dossier_id,
      question,
      chunksContext,
      cacheExpired,
    });

    const { data: assistantMessage, error } = await supabase
      .from("chat_messages")
      .insert({
        dossier_id,
        organization_id: organizationId,
        user_id: user.id,
        role: "assistant",
        content: result.reponse,
        sources: result.sources,
        model: result.modelUsed as "fable_5" | "sonnet_5",
        complexity_label: result.complexite,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    return handleApiError(error);
  }
}
