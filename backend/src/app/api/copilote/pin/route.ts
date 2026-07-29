import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { classifyAjoutCopilote } from "@/lib/ai/router";
import type { Enums } from "@/types/database";

type ProfilAnalyse = Enums<"profil_analyse">;

const pinSchema = z.object({
  dossier_id: z.string().uuid(),
  chat_message_id: z.string().uuid(),
  // absent/null = s'applique à tous les profils du dossier (Note d'Architecture, I.4)
  profil_cible: z
    .enum(["pe_vc", "ma", "family_office", "cfo", "audit_conseil", "generaliste", "personnalise"])
    .nullable()
    .optional(),
});

/**
 * Épinglage d'une réponse du Copilote à la note d'analyse (Module 3 -> I.4).
 * Coût marginal : la question est déjà comptée dans le budget chat existant,
 * seul le classement Haiku 4.5 s'ajoute.
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, organizationId } = await requireAuthContext();
    const body = pinSchema.parse(await request.json());

    const { data: message } = await supabase
      .from("chat_messages")
      .select("id, content, sources, dossier_id, role")
      .eq("id", body.chat_message_id)
      .eq("dossier_id", body.dossier_id)
      .eq("organization_id", organizationId)
      .single();

    if (!message || message.role !== "assistant") {
      throw new ApiError(404, "Réponse du Copilote introuvable.");
    }

    const categorie = await classifyAjoutCopilote({
      organizationId,
      dossierId: body.dossier_id,
      texte: message.content,
    });

    const { data: ajout, error } = await supabase
      .from("ajouts_copilote")
      .insert({
        dossier_id: body.dossier_id,
        organization_id: organizationId,
        profil_cible: (body.profil_cible ?? null) as ProfilAnalyse | null,
        categorie,
        contenu: message.content,
        sources: message.sources,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ajout }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
