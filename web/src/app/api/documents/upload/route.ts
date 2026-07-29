import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

const uploadFieldsSchema = z.object({
  dossier_id: z.string().uuid(),
});

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-excel",
];

/**
 * Upload sécurisé PDF/Excel/Word (Module 1 -- jusqu'à 50 fichiers par dossier,
 * limite appliquée par un trigger DB). Le texte n'est PAS encore extrait ici :
 * voir /api/documents/:id/indexer.
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, organizationId } = await requireAuthContext();
    const formData = await request.formData();
    const { dossier_id } = uploadFieldsSchema.parse({
      dossier_id: formData.get("dossier_id"),
    });
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError(400, "Fichier manquant.");
    }
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      throw new ApiError(400, `Type de fichier non supporté : ${file.type}`);
    }

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("id")
      .eq("id", dossier_id)
      .eq("organization_id", organizationId)
      .single();

    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    const storagePath = `${organizationId}/${dossier_id}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) throw new ApiError(500, `Échec de l'upload : ${uploadError.message}`);

    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        dossier_id,
        organization_id: organizationId,
        storage_path: storagePath,
        original_name: file.name,
        mime_type: file.type,
        status: "en_attente",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
