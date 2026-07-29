import { NextRequest, NextResponse } from "next/server";
import { assertCronAuthorized } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Purge définitive des dossiers en corbeille depuis plus de 30 jours (Note
 * d'Architecture, section F). Réutilise le même mécanisme que le droit à
 * l'effacement (section H), simplement paramétré par dossier_id. À planifier
 * quotidiennement (Vercel Cron / scheduler externe) avec l'en-tête
 * Authorization: Bearer <CRON_SECRET>.
 */
async function handler(request: NextRequest) {
  const unauthorized = assertCronAuthorized(request);
  if (unauthorized) return unauthorized;

  const admin = getSupabaseAdmin();

  const { data: dossiersAPurger, error } = await admin
    .from("dossiers")
    .select("id, organization_id")
    .eq("status", "corbeille")
    .lte("purge_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const purged: string[] = [];

  for (const dossier of dossiersAPurger ?? []) {
    const { data: documents } = await admin
      .from("documents")
      .select("storage_path")
      .eq("dossier_id", dossier.id);

    if (documents && documents.length > 0) {
      await admin.storage.from("documents").remove(documents.map((d) => d.storage_path));
    }

    const { data: exportsRows } = await admin
      .from("exports")
      .select("storage_path")
      .eq("dossier_id", dossier.id);

    const exportPaths = (exportsRows ?? []).map((e) => e.storage_path).filter((p): p is string => !!p);
    if (exportPaths.length > 0) {
      await admin.storage.from("exports").remove(exportPaths);
    }

    // Cascade FK : documents, document_chunks, extractions, notes_profils,
    // ajouts_copilote, chat_messages, contradictions, checklist_items, exports.
    const { error: deleteError } = await admin.from("dossiers").delete().eq("id", dossier.id);
    if (!deleteError) purged.push(dossier.id);
  }

  return NextResponse.json({ purged_count: purged.length, purged_ids: purged });
}

export const GET = handler;
export const POST = handler;
