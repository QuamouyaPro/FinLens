import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Archiver un dossier libère immédiatement un emplacement sans rien supprimer :
 * l'extraction, les notes par profil, Qdrant/pgvector et l'historique de chat
 * restent intacts et consultables après restauration (Note d'Architecture, F).
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const { data, error } = await supabase
      .from("dossiers")
      .update({ status: "archive" })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error || !data) throw new ApiError(404, "Dossier introuvable.");

    return NextResponse.json({ dossier: data });
  } catch (error) {
    return handleApiError(error);
  }
}
