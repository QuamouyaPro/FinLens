import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError } from "@/lib/api-context";

type RouteContext = { params: Promise<{ id: string }> };

// GET — liste des contradictions détectées (module Contrôles)
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const { data, error } = await supabase
      .from("contradictions")
      .select("*")
      .eq("dossier_id", id)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ contradictions: data });
  } catch (error) {
    return handleApiError(error);
  }
}
