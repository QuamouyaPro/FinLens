import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

const arbitrerSchema = z.object({ status: z.enum(["ouverte", "arbitree"]) });

type RouteContext = { params: Promise<{ id: string }> };

// PATCH — marquer une contradiction comme arbitrée (action rapide du module Contrôles)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, user, organizationId } = await requireAuthContext();
    const { status } = arbitrerSchema.parse(await request.json());

    const { data, error } = await supabase
      .from("contradictions")
      .update({
        status,
        arbitre_par: status === "arbitree" ? user.id : null,
        arbitre_at: status === "arbitree" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error || !data) throw new ApiError(404, "Contradiction introuvable.");

    return NextResponse.json({ contradiction: data });
  } catch (error) {
    return handleApiError(error);
  }
}
