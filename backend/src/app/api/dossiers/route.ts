import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError } from "@/lib/api-context";
import {
  assertDossierCapNotReached,
  assertEssentielActifsCapNotReached,
} from "@/lib/quotas";

const createDossierSchema = z.object({
  name: z.string().min(1).max(200),
  type_operation: z
    .enum(["due_diligence", "lbo", "serie_a_b", "screening", "veille"])
    .default("screening"),
});

const listQuerySchema = z.object({
  status: z.enum(["actif", "archive", "corbeille"]).optional(),
});

// GET /api/dossiers?status=actif — liste des dossiers de l'organisation (filtres, recherche)
export async function GET(request: NextRequest) {
  try {
    const { supabase, organizationId } = await requireAuthContext();
    const { status } = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    let query = supabase
      .from("dossiers")
      .select("*")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ dossiers: data });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/dossiers — création d'un dossier (une entreprise étudiée)
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, organizationId } = await requireAuthContext();
    const body = createDossierSchema.parse(await request.json());

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
      .insert({
        organization_id: organizationId,
        owner_id: user.id,
        name: body.name,
        type_operation: body.type_operation,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dossier: data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
