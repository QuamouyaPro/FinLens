import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import {
  assertDossierCapNotReached,
  assertEssentielActifsCapNotReached,
} from "@/lib/quotas";

type RouteContext = { params: Promise<{ id: string }> };

/** Restaure un dossier archivé ou en corbeille (avant purge définitive) vers actif. */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, user, organizationId } = await requireAuthContext();

    const { data: org } = await supabase
      .from("organizations")
      .select("offre")
      .eq("id", organizationId)
      .single();

    if (org?.offre === "essentiel") {
      await assertEssentielActifsCapNotReached(supabase, organizationId);
    } else {
      await assertDossierCapNotReached(supabase, organizationId, user.id);
    }

    const { data, error } = await supabase
      .from("dossiers")
      .update({ status: "actif", trashed_at: null, purge_at: null })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .in("status", ["archive", "corbeille"])
      .select()
      .single();

    if (error || !data) throw new ApiError(404, "Dossier introuvable ou déjà actif.");

    return NextResponse.json({ dossier: data });
  } catch (error) {
    return handleApiError(error);
  }
}
