import { NextRequest, NextResponse } from "next/server";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { runReformulationProfil } from "@/lib/ai/router";
import { PROFILS_ESSENTIEL } from "@/lib/ai/prompts/profils";
import type { Enums } from "@/types/database";

type RouteContext = { params: Promise<{ id: string; profil: string }> };
type ProfilAnalyse = Enums<"profil_analyse">;

const PROFILS_VALIDES: ProfilAnalyse[] = [
  "pe_vc",
  "ma",
  "family_office",
  "cfo",
  "audit_conseil",
  "generaliste",
  "personnalise",
];

// GET — lecture directe en base, instantanée, aucun appel IA (Note d'Architecture, I.1)
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id, profil } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    if (!PROFILS_VALIDES.includes(profil as ProfilAnalyse)) {
      throw new ApiError(400, "Profil d'analyse inconnu.");
    }

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("id, personnalise_indicateurs")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();
    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    const { data: note } = await supabase
      .from("notes_profils")
      .select("*")
      .eq("dossier_id", id)
      .eq("profil", profil as ProfilAnalyse)
      .maybeSingle();

    if (!note) {
      return NextResponse.json(
        { error: "Cette note n'a pas encore été générée pour ce profil." },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST — (re)génère la note du profil Personnalisé après que l'utilisateur a
 * choisi ses indicateurs (Note explicative, section 9.4). Les 6 profils métier
 * sont déjà pré-générés par /api/dossiers/:id/analyser ; cette route ne sert
 * qu'au profil Personnalisé et à une régénération explicite.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id, profil } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    if (!PROFILS_VALIDES.includes(profil as ProfilAnalyse)) {
      throw new ApiError(400, "Profil d'analyse inconnu.");
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("offre")
      .eq("id", organizationId)
      .single();

    if (org?.offre === "essentiel" && !PROFILS_ESSENTIEL.includes(profil as ProfilAnalyse)) {
      throw new ApiError(403, "Ce profil est réservé aux offres Analyste et Fonds.");
    }
    if (profil === "personnalise" && org?.offre === "essentiel") {
      throw new ApiError(403, "Le profil Personnalisé est réservé aux offres Analyste et Fonds.");
    }

    const { data: extraction } = await supabase
      .from("extractions")
      .select("contenu_json")
      .eq("dossier_id", id)
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (!extraction) {
      throw new ApiError(422, "Aucune extraction disponible : lancez d'abord l'analyse du dossier.");
    }

    let indicateursPersonnalises: string[] | undefined;
    if (profil === "personnalise") {
      const body = await request.json().catch(() => ({}));
      indicateursPersonnalises = Array.isArray(body.indicateurs) ? body.indicateurs.slice(0, 12) : [];

      await supabase
        .from("dossiers")
        .update({ personnalise_indicateurs: indicateursPersonnalises })
        .eq("id", id);
    }

    const note = await runReformulationProfil({
      organizationId,
      dossierId: id,
      profil: profil as ProfilAnalyse,
      extractionJson: JSON.stringify(extraction.contenu_json),
      indicateursPersonnalises,
      useCachedExtraction: false,
    });

    const { data: saved, error } = await supabase
      .from("notes_profils")
      .upsert(
        {
          dossier_id: id,
          organization_id: organizationId,
          profil: profil as ProfilAnalyse,
          contenu_json: note,
          risk_score: note.score_risque,
        },
        { onConflict: "dossier_id,profil" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ note: saved });
  } catch (error) {
    return handleApiError(error);
  }
}
