import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ListeDossiers, type DossierListe } from "@/components/dossiers/liste-dossiers";
import { NouveauDossier } from "@/components/dossiers/nouveau-dossier";
import { OFFRES } from "@/lib/offres";

export const metadata: Metadata = { title: "Dossiers — FinLens" };

export default async function DossiersPage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  const { data: dossiers } = await supabase
    .from("dossiers")
    .select("id, name, status, type_operation, risk_score, updated_at, purge_at")
    .eq("organization_id", session.organizationId)
    .order("updated_at", { ascending: false });

  const ids = (dossiers ?? []).map((d) => d.id);

  // Un dossier affiche son nombre de documents indexés et de contradictions
  // ouvertes : deux requêtes groupées plutôt qu'une par ligne.
  const [{ data: documents }, { data: contradictions }] = await Promise.all([
    ids.length
      ? supabase.from("documents").select("dossier_id").in("dossier_id", ids).is("is_duplicate_of", null)
      : Promise.resolve({ data: [] as { dossier_id: string }[] }),
    ids.length
      ? supabase.from("contradictions").select("dossier_id").in("dossier_id", ids).eq("status", "ouverte")
      : Promise.resolve({ data: [] as { dossier_id: string }[] }),
  ]);

  function compter(lignes: { dossier_id: string }[] | null, id: string) {
    return (lignes ?? []).filter((l) => l.dossier_id === id).length;
  }

  const liste: DossierListe[] = (dossiers ?? []).map((d) => ({
    ...d,
    nb_documents: compter(documents, d.id),
    nb_signaux: compter(contradictions, d.id),
  }));

  const actifs = liste.filter((d) => d.status === "actif").length;
  const plafond = OFFRES[session.offre].dossiersActifsMax;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dossiers</h1>
          <p>Vos espaces de travail par entreprise étudiée — la pastille indique le score de risque.</p>
        </div>
        <NouveauDossier plafondAtteint={actifs >= plafond} plafond={plafond} />
      </div>

      {actifs >= plafond ? (
        <p
          className="badge badge--warn"
          style={{ height: "auto", padding: "11px 15px", marginBottom: 18, display: "block", lineHeight: 1.55 }}
        >
          Plafond de {plafond} dossiers ouverts atteint. Archivez un dossier terminé pour en ouvrir un
          nouveau — rien n&apos;est supprimé, et vous pourrez le restaurer à tout moment.
        </p>
      ) : null}

      <ListeDossiers dossiers={liste} />
    </>
  );
}
