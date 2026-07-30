import { NextRequest, NextResponse } from "next/server";
import { requireAuthContext, handleApiError } from "@/lib/api-context";

/**
 * Signaux (Note de fonctionnement, section 13) : vue centralisée de toutes les
 * alertes détectées dans l'ensemble des dossiers — contradictions critiques,
 * points à surveiller, informations.
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, organizationId } = await requireAuthContext();
    const filtre = request.nextUrl.searchParams.get("filtre");

    let query = supabase
      .from("contradictions")
      .select("*, dossiers!inner(id, name, status)")
      .eq("organization_id", organizationId)
      .neq("dossiers.status", "corbeille")
      .order("created_at", { ascending: false });

    if (filtre === "critiques") query = query.eq("gravite", "critique");
    if (filtre === "surveiller") query = query.eq("gravite", "a_verifier");
    if (filtre === "non_lus") query = query.eq("status", "ouverte");

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ signaux: data ?? [] });
  } catch (error) {
    return handleApiError(error);
  }
}
