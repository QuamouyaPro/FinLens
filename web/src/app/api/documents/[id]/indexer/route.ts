import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { extractPdfPages } from "@/lib/pdf/extract";
import { chunkPages } from "@/lib/pdf/chunk";
import { embedTexts, embeddingToSqlVector } from "@/lib/ai/embeddings";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Extrait le texte d'un document, le découpe et le vectorise dans document_chunks
 * (remplace Qdrant, non accessible depuis cet environnement). Détecte aussi les
 * doublons de contenu au sein d'un même dossier (Module 1).
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, user, organizationId } = await requireAuthContext();

    const { data: document } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (!document) throw new ApiError(404, "Document introuvable.");

    if (document.mime_type !== "application/pdf") {
      await supabase
        .from("documents")
        .update({
          status: "erreur",
          error_message: "Extraction Word/Excel non encore implémentée dans ce backend (PDF uniquement pour le moment).",
        })
        .eq("id", id);
      throw new ApiError(422, "Seuls les fichiers PDF sont supportés pour l'instant.");
    }

    await supabase.from("documents").update({ status: "en_cours" }).eq("id", id);

    const admin = getSupabaseAdmin();
    const { data: fileBlob, error: downloadError } = await admin.storage
      .from("documents")
      .download(document.storage_path);

    if (downloadError || !fileBlob) {
      throw new ApiError(500, `Échec du téléchargement : ${downloadError?.message}`);
    }

    const pages = await extractPdfPages(await fileBlob.arrayBuffer());
    const fullText = pages.map((p) => p.text).join("\n");
    const contentHash = createHash("sha256").update(fullText).digest("hex");

    const { data: duplicate } = await supabase
      .from("documents")
      .select("id")
      .eq("dossier_id", document.dossier_id)
      .eq("content_hash", contentHash)
      .neq("id", id)
      .maybeSingle();

    if (duplicate) {
      const { data: updated } = await supabase
        .from("documents")
        .update({
          status: "indexe",
          page_count: pages.length,
          content_hash: contentHash,
          is_duplicate_of: duplicate.id,
        })
        .eq("id", id)
        .select()
        .single();

      return NextResponse.json({ document: updated, duplicate: true });
    }

    const chunks = chunkPages(pages);
    if (chunks.length > 0) {
      const embeddings = await embedTexts(chunks.map((c) => c.content), "document");

      const rows = chunks.map((chunk, index) => ({
        document_id: id,
        dossier_id: document.dossier_id,
        organization_id: organizationId,
        owner_id: user.id,
        page_number: chunk.page,
        chunk_index: chunk.chunkIndex,
        content: chunk.content,
        embedding: embeddingToSqlVector(embeddings[index]),
      }));

      const { error: chunksError } = await supabase.from("document_chunks").insert(rows);
      if (chunksError) throw chunksError;
    }

    const { data: updated, error } = await supabase
      .from("documents")
      .update({ status: "indexe", page_count: pages.length, content_hash: contentHash })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ document: updated, duplicate: false });
  } catch (error) {
    return handleApiError(error);
  }
}
