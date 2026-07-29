import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { runComparaison } from "@/lib/ai/router";

const comparaisonSchema = z.object({
  dossier_ids: z.array(z.string().uuid()).min(2).max(6),
});

/**
 * Module 4 -- Comparateur de dossiers, réservé aux offres Analyste et Fonds
 * (Note explicative, section 7 ; Couts & Pricing, section 3). Compare des
 * dossiers déjà analysés à partir de leurs extractions, pas des documents bruts.
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, organizationId } = await requireAuthContext();
    const { dossier_ids } = comparaisonSchema.parse(await request.json());

    const { data: org } = await supabase
      .from("organizations")
      .select("offre")
      .eq("id", organizationId)
      .single();

    if (org?.offre === "essentiel") {
      throw new ApiError(403, "Le comparateur de dossiers est réservé aux offres Analyste et Fonds.");
    }

    const { data: dossiers } = await supabase
      .from("dossiers")
      .select("id, name")
      .eq("organization_id", organizationId)
      .in("id", dossier_ids);

    if (!dossiers || dossiers.length !== dossier_ids.length) {
      throw new ApiError(404, "Un ou plusieurs dossiers sont introuvables.");
    }

    const { data: extractions } = await supabase
      .from("extractions")
      .select("dossier_id, contenu_json")
      .in("dossier_id", dossier_ids);

    if (!extractions || extractions.length !== dossier_ids.length) {
      throw new ApiError(
        422,
        "Tous les dossiers doivent avoir été analysés (extraction disponible) avant comparaison."
      );
    }

    const namesById = new Map(dossiers.map((d) => [d.id, d.name]));
    const dossiersContext = extractions
      .map((e) => `[Dossier: ${namesById.get(e.dossier_id)}]\n${JSON.stringify(e.contenu_json)}`)
      .join("\n\n");

    const contenu = await runComparaison({ organizationId, userId: user.id, dossiersContext });

    const { data: comparison, error } = await supabase
      .from("comparisons")
      .insert({
        organization_id: organizationId,
        dossier_ids,
        created_by: user.id,
        contenu_json: contenu,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comparison }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
