import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { RechercheGlobale } from "@/components/recherche/recherche-globale";

export const metadata: Metadata = { title: "Recherche globale — FinLens" };

export default async function RecherchePage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  const { count } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", session.organizationId);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Recherche globale</h1>
          <p>Une question, tous vos dossiers actifs — chaque résultat renvoie à sa page exacte.</p>
        </div>
      </div>

      <RechercheGlobale aDesDocuments={(count ?? 0) > 0} />
    </>
  );
}
