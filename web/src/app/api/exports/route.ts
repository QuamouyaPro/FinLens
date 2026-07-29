import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { buildExportContent } from "@/lib/export/content";
import { generateWordExport } from "@/lib/export/word";
import { generatePdfExport } from "@/lib/export/pdf";
import type { NoteProfilContenu } from "@/types/domain";

const exportSchema = z.object({
  dossier_id: z.string().uuid(),
  profil: z.enum(["pe_vc", "ma", "family_office", "cfo", "audit_conseil", "generaliste", "personnalise"]),
  format: z.enum(["pdf", "word"]),
  template: z.string().default("note_investissement"),
});

/** Module 5 -- Export PDF/Word de la synthèse courte ou de la note complète. */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, organizationId } = await requireAuthContext();
    const body = exportSchema.parse(await request.json());

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("id, name")
      .eq("id", body.dossier_id)
      .eq("organization_id", organizationId)
      .single();
    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    const { data: note } = await supabase
      .from("notes_profils")
      .select("contenu_json")
      .eq("dossier_id", body.dossier_id)
      .eq("profil", body.profil)
      .maybeSingle();
    if (!note) throw new ApiError(422, "La note de ce profil n'a pas encore été générée.");

    const { data: ajouts } = await supabase
      .from("ajouts_copilote")
      .select("categorie, contenu, profil_cible")
      .eq("dossier_id", body.dossier_id)
      .or(`profil_cible.is.null,profil_cible.eq.${body.profil}`);

    const content = buildExportContent(
      dossier.name,
      body.profil,
      note.contenu_json as unknown as NoteProfilContenu,
      ajouts ?? []
    );

    const buffer =
      body.format === "word" ? await generateWordExport(content) : await generatePdfExport(content);

    const extension = body.format === "word" ? "docx" : "pdf";
    const storagePath = `${organizationId}/${body.dossier_id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("exports")
      .upload(storagePath, buffer, {
        contentType:
          body.format === "word"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/pdf",
      });
    if (uploadError) throw new ApiError(500, `Échec de l'export : ${uploadError.message}`);

    const { data: exportRow, error } = await supabase
      .from("exports")
      .insert({
        dossier_id: body.dossier_id,
        organization_id: organizationId,
        created_by: user.id,
        format: body.format,
        template: body.template,
        profil: body.profil,
        storage_path: storagePath,
      })
      .select()
      .single();
    if (error) throw error;

    const { data: signedUrl } = await supabase.storage
      .from("exports")
      .createSignedUrl(storagePath, 60 * 10);

    return NextResponse.json({ export: exportRow, download_url: signedUrl?.signedUrl }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
