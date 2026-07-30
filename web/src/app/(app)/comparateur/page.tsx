import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { Comparateur, type DossierComparable } from "@/components/comparateur/comparateur";

export const metadata: Metadata = { title: "Comparateur — FinLens" };

export default async function ComparateurPage() {
  const session = await requireSession();

  // Réservé aux offres Analyste et Fonds (Coûts & Pricing, section 3).
  if (session.offre === "essentiel") {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Comparateur</h1>
            <p>Confrontez deux dossiers ligne par ligne, sur les indicateurs qui comptent.</p>
          </div>
        </div>

        <div className="empty">
          <div className="ic">
            <Icon name="lock" />
          </div>
          <b>Le comparateur fait partie des offres Analyste et Fonds</b>
          <span style={{ display: "block", marginBottom: 18 }}>
            Il croise plusieurs dossiers déjà analysés et produit un tableau comparatif sourcé.
          </span>
          <Link href="/facturation" className="btn btn--primary">
            Voir les offres
          </Link>
        </div>
      </>
    );
  }

  const supabase = await getSupabaseServer();

  const [{ data: dossiers }, { data: extractions }] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id, name")
      .eq("organization_id", session.organizationId)
      .in("status", ["actif", "archive"])
      .order("updated_at", { ascending: false }),
    supabase.from("extractions").select("dossier_id").eq("organization_id", session.organizationId),
  ]);

  const analyses = new Set((extractions ?? []).map((e) => e.dossier_id));
  const comparables: DossierComparable[] = (dossiers ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    analyse: analyses.has(d.id),
  }));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Comparateur</h1>
          <p>Confrontez deux dossiers ligne par ligne, sur les indicateurs qui comptent.</p>
        </div>
      </div>

      <Comparateur dossiers={comparables} />
    </>
  );
}
