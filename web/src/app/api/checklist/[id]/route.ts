import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";

const updateSchema = z.object({ auto_checked: z.boolean().optional() });

type RouteContext = { params: Promise<{ id: string }> };

// PATCH — cocher/décocher manuellement une ligne de checklist
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();
    const body = updateSchema.parse(await request.json());

    const { data, error } = await supabase
      .from("checklist_items")
      .update(body)
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error || !data) throw new ApiError(404, "Élément de checklist introuvable.");

    return NextResponse.json({ item: data });
  } catch (error) {
    return handleApiError(error);
  }
}
