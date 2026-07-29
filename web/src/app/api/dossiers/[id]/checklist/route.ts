import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError } from "@/lib/api-context";

type RouteContext = { params: Promise<{ id: string }> };

// GET — checklist de due diligence du dossier (module Contrôles)
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("dossier_id", id)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ checklist: data });
  } catch (error) {
    return handleApiError(error);
  }
}
