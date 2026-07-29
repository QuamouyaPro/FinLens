import { NextResponse } from "next/server";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { assertQuotaAndIncrement } from "@/lib/quotas";
import { runExtraction, runReformulationProfil, detectContradictions } from "@/lib/ai/router";
import { PROFILS_ESSENTIEL, PROFILS_TOUTES_OFFRES } from "@/lib/ai/prompts/profils";
import { CHECKLIST_TEMPLATES } from "@/lib/checklist";
import type { ExtractionContenu } from "@/types/domain";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Pipeline complète d'analyse d'un dossier (Note d'Architecture, section 1 et 4.I) :
 * 1. Étage 1 -- extraction exhaustive Fable 5 (une fois par dossier, 6 catégories)
 * 2. Étage 2 -- reformulation par profil Sonnet 5 (tous les profils disponibles
 *    sur l'offre, pré-générés en arrière-plan -- le profil Personnalisé est exclu,
 *    généré à la demande une fois les indicateurs choisis)
 * 3. Détection de contradictions + checklist de due diligence pré-chargée
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, organizationId } = await requireAuthContext();

    const { data: dossier } = await supabase
      .from("dossiers")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (!dossier) throw new ApiError(404, "Dossier introuvable.");

    const { data: org } = await supabase
      .from("organizations")
      .select("offre")
      .eq("id", organizationId)
      .single();
    if (!org) throw new ApiError(404, "Organisation introuvable.");

    const { data: existingExtraction } = await supabase
      .from("extractions")
      .select("id")
      .eq("dossier_id", id)
      .maybeSingle();

    // Le quota Essentiel (3 nouveaux dossiers analysés / mois) ne s'applique
    // qu'à une première analyse -- rotation libre entre dossiers déjà analysés.
    if (!existingExtraction && org.offre === "essentiel") {
      await assertQuotaAndIncrement(supabase, organizationId, "dossier_analyse");
    }

    const { data: documents } = await supabase
      .from("documents")
      .select("id, original_name")
      .eq("dossier_id", id)
      .eq("status", "indexe")
      .is("is_duplicate_of", null);

    if (!documents || documents.length === 0) {
      throw new ApiError(
        422,
        "Aucun document indexé dans ce dossier. Uploadez et indexez au moins un document avant de lancer l'analyse."
      );
    }

    const { data: chunks } = await supabase
      .from("document_chunks")
      .select("document_id, page_number, content, chunk_index")
      .eq("dossier_id", id)
      .order("document_id")
      .order("chunk_index");

    const namesById = new Map(documents.map((d) => [d.id, d.original_name]));
    const documentsText = (chunks ?? [])
      .map((c) => `[${namesById.get(c.document_id) ?? c.document_id} | Page ${c.page_number ?? "?"}]\n${c.content}`)
      .join("\n\n");

    // Étage 1 : extraction exhaustive (une seule lecture du document source)
    const { contenu: extractionContenu } = await runExtraction({
      organizationId,
      dossierId: id,
      documentsText,
    });

    const { data: extraction, error: extractionError } = await supabase
      .from("extractions")
      .upsert(
        { dossier_id: id, organization_id: organizationId, contenu_json: extractionContenu, sources: [] },
        { onConflict: "dossier_id" }
      )
      .select()
      .single();
    if (extractionError) throw extractionError;

    // Étage 2 : reformulation par profil -- tous les profils dispo sur l'offre,
    // sauf "personnalise" (généré à la demande, voir /api/dossiers/:id/profils/personnalise)
    const profilsAutorises =
      org.offre === "essentiel" ? PROFILS_ESSENTIEL : PROFILS_TOUTES_OFFRES.filter((p) => p !== "personnalise");

    const extractionJson = JSON.stringify(extractionContenu satisfies ExtractionContenu);

    for (let i = 0; i < profilsAutorises.length; i++) {
      const profil = profilsAutorises[i];
      const note = await runReformulationProfil({
        organizationId,
        dossierId: id,
        profil,
        extractionJson,
        useCachedExtraction: i > 0, // la 1ère paie le tarif plein, les suivantes lisent le cache 1h
      });

      await supabase.from("notes_profils").upsert(
        {
          dossier_id: id,
          organization_id: organizationId,
          profil,
          contenu_json: note,
          risk_score: note.score_risque,
        },
        { onConflict: "dossier_id,profil" }
      );
    }

    // Mise à jour du score de risque global du dossier (profil actif par défaut)
    await supabase
      .from("dossiers")
      .update({ risk_score: null }) // recalculé côté lecture selon le profil sélectionné
      .eq("id", id);

    // Détection de contradictions entre documents du dossier
    const contradictions = await detectContradictions({ organizationId, dossierId: id, documentsText });
    if (contradictions.length > 0) {
      await supabase.from("contradictions").insert(
        contradictions.map((c) => ({
          dossier_id: id,
          organization_id: organizationId,
          gravite: c.gravite,
          description: c.description,
          source_a: c.source_a,
          source_b: c.source_b,
        }))
      );
    }

    // Checklist pré-chargée selon le type d'opération (une seule fois)
    const { count: existingChecklistCount } = await supabase
      .from("checklist_items")
      .select("id", { count: "exact", head: true })
      .eq("dossier_id", id);

    if (!existingChecklistCount) {
      const template = CHECKLIST_TEMPLATES[dossier.type_operation];
      await supabase.from("checklist_items").insert(
        template.map((label) => ({
          dossier_id: id,
          organization_id: organizationId,
          label,
          requires_manual_check: true,
        }))
      );
    }

    return NextResponse.json({
      extraction,
      profils_generes: profilsAutorises,
      contradictions_detectees: contradictions.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
