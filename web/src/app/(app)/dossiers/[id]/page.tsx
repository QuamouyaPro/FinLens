import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { SelecteurProfil } from "@/components/dossiers/selecteur-profil";
import { OngletsDossier } from "@/components/dossiers/onglets-dossier";
import { PanneauSynthese } from "@/components/dossiers/panneau-synthese";
import { PanneauDocuments, type DocumentListe } from "@/components/dossiers/panneau-documents";
import { Copilote } from "@/components/dossiers/copilote";
import { PanneauControles, type Contradiction, type ItemChecklist } from "@/components/dossiers/panneau-controles";
import { PanneauExport } from "@/components/dossiers/panneau-export";
import { TYPES_OPERATION } from "@/lib/offres";
import type { NoteProfilContenu, SourceCitation } from "@/types/domain";
import type { Enums } from "@/types/database";

export const metadata: Metadata = { title: "Dossier — FinLens" };

export default async function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  const { data: dossier } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .eq("organization_id", session.organizationId)
    .maybeSingle();

  if (!dossier) notFound();

  const [
    { data: documents },
    { data: notes },
    { data: extraction },
    { data: messages },
    { data: contradictions },
    { data: checklist },
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("id, original_name, mime_type, page_count, status, is_duplicate_of, error_message, created_at")
      .eq("dossier_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("notes_profils").select("profil, contenu_json").eq("dossier_id", id),
    supabase.from("extractions").select("id").eq("dossier_id", id).maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, role, content, sources, complexity_label")
      .eq("dossier_id", id)
      .order("created_at", { ascending: true })
      .limit(100),
    supabase
      .from("contradictions")
      .select("id, gravite, description, source_a, source_b, status")
      .eq("dossier_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("checklist_items")
      .select("id, label, auto_checked, requires_manual_check")
      .eq("dossier_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const profilsGeneres = (notes ?? []).map((n) => n.profil);
  const noteActive = (notes ?? []).find((n) => n.profil === dossier.active_profil);
  const documentsIndexes = (documents ?? []).filter(
    (d) => d.status === "indexe" && !d.is_duplicate_of
  );
  const contradictionsOuvertes = (contradictions ?? []).filter((c) => c.status === "ouverte").length;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="crumb" style={{ marginBottom: 8 }}>
            <Link href="/dossiers">Dossiers</Link>
            <Icon name="split" style={{ transform: "rotate(90deg)" }} />
            <b>{dossier.name}</b>
          </div>
          <h1>{dossier.name}</h1>
          <p>
            {TYPES_OPERATION[dossier.type_operation]} · {documentsIndexes.length} document
            {documentsIndexes.length > 1 ? "s" : ""} indexé{documentsIndexes.length > 1 ? "s" : ""}
            {dossier.status !== "actif" ? ` · ${dossier.status === "archive" ? "archivé" : "en corbeille"}` : ""}
          </p>
        </div>
      </div>

      <SelecteurProfil
        dossierId={dossier.id}
        profilActif={dossier.active_profil}
        offre={session.offre}
        profilsGeneres={profilsGeneres}
      />

      <OngletsDossier
        onglets={[
          {
            cle: "synthese",
            label: "Synthèse",
            icon: "list",
            contenu: (
              <PanneauSynthese
                dossierId={dossier.id}
                note={(noteActive?.contenu_json as unknown as NoteProfilContenu) ?? null}
                nbDocumentsIndexes={documentsIndexes.length}
                extractionExiste={Boolean(extraction)}
              />
            ),
          },
          {
            cle: "documents",
            label: "Documents",
            icon: "folder",
            compteur: (documents ?? []).length,
            contenu: (
              <PanneauDocuments
                dossierId={dossier.id}
                documents={(documents ?? []) as DocumentListe[]}
              />
            ),
          },
          {
            cle: "copilote",
            label: "Copilote",
            icon: "chat",
            contenu: (
              <Copilote
                dossierId={dossier.id}
                typeOperation={dossier.type_operation}
                profilActif={dossier.active_profil}
                nbDocumentsIndexes={documentsIndexes.length}
                messagesInitiaux={(messages ?? []).map((m) => ({
                  id: m.id,
                  role: m.role as Enums<"chat_role">,
                  content: m.content,
                  sources: (m.sources ?? []) as unknown as SourceCitation[],
                  complexity_label: m.complexity_label,
                }))}
              />
            ),
          },
          {
            cle: "controles",
            label: "Contrôles",
            icon: "split",
            alerte: contradictionsOuvertes > 0,
            contenu: (
              <PanneauControles
                contradictions={(contradictions ?? []) as unknown as Contradiction[]}
                checklist={(checklist ?? []) as ItemChecklist[]}
              />
            ),
          },
          {
            cle: "export",
            label: "Export",
            icon: "dl",
            contenu: (
              <PanneauExport
                dossierId={dossier.id}
                profilActif={dossier.active_profil}
                noteDisponible={Boolean(noteActive)}
              />
            ),
          },
        ]}
      />
    </>
  );
}
