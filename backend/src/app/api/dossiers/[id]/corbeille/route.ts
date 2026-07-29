import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

type RouteContext = { params: Promise<{ id: string }> };

const GRACE_PERIOD_DAYS = 30;

/**
 * Mise à la corbeille (Note d'Architecture, section F) : délai de grâce de 30
 * jours avant purge définitive (Supabase + pgvector), via le cron
 * /api/cron/purge-corbeille. Libère un slot immédiatement.
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const purgeAt = new Date();
    purgeAt.setDate(purgeAt.getDate() + GRACE_PERIOD_DAYS);

    const { data, error } = await supabase
      .from("dossiers")
      .update({
        status: "corbeille",
        trashed_at: new Date().toISOString(),
        purge_at: purgeAt.toISOString(),
      })
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
