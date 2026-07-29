import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

const updateDossierSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  active_profil: z
    .enum(["pe_vc", "ma", "family_office", "cfo", "audit_conseil", "generaliste", "personnalise"])
    .optional(),
  personnalise_indicateurs: z.array(z.string()).max(12).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const { data, error } = await supabase
      .from("dossiers")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (error) throw new ApiError(404, "Dossier introuvable.");

    return NextResponse.json({ dossier: data });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/dossiers/:id — bascule de profil actif (instantané, aucun appel IA),
// sélection des indicateurs du profil Personnalisé (plafond 12), renommage.
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();
    const body = updateDossierSchema.parse(await request.json());

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("id, organization_id")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    if (body.active_profil) {
      const { data: org } = await supabase
        .from("organizations")
        .select("offre")
        .eq("id", organizationId)
        .single();

      const profilsEssentiel = ["generaliste", "cfo", "family_office"];
      if (org?.offre === "essentiel" && !profilsEssentiel.includes(body.active_profil)) {
        throw new ApiError(
          403,
          "Ce profil d'analyse est réservé aux offres Analyste et Fonds."
        );
      }
    }

    const { data, error } = await supabase
      .from("dossiers")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dossier: data });
  } catch (error) {
    return handleApiError(error);
  }
}
