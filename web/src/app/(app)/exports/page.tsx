import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { dateRelative } from "@/lib/format";
import { PROFIL_LABELS_COURTS } from "@/lib/offres";

export const metadata: Metadata = { title: "Exports — FinLens" };

const MODELES: Record<string, string> = {
  note_investissement: "Note d'investissement",
  screening_rapide: "Screening rapide",
  due_diligence: "Due diligence complète",
};

export default async function ExportsPage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  const { data: exports } = await supabase
    .from("exports")
    .select("id, format, template, profil, created_at, dossier_id, dossiers(name)")
    .eq("organization_id", session.organizationId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Exports</h1>
          <p>Les documents générés depuis vos dossiers, avec le profil de lecture utilisé.</p>
        </div>
      </div>

      {(exports ?? []).length === 0 ? (
        <div className="empty">
          <div className="ic">
            <Icon name="dl" />
          </div>
          <b>Aucun export pour le moment</b>
          Ouvrez un dossier analysé, puis générez la note depuis son onglet Export.
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Dossier</th>
              <th scope="col">Modèle</th>
              <th scope="col">Profil</th>
              <th scope="col">Format</th>
              <th scope="col">Généré</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {(exports ?? []).map((item) => {
              const dossier = item.dossiers as unknown as { name: string } | null;
              return (
                <tr key={item.id}>
                  <td>{dossier?.name ?? "Dossier supprimé"}</td>
                  <td>{MODELES[item.template] ?? item.template}</td>
                  <td>{PROFIL_LABELS_COURTS[item.profil]}</td>
                  <td>
                    <span className="badge badge--muted">{item.format === "pdf" ? "PDF" : "Word"}</span>
                  </td>
                  <td>{dateRelative(item.created_at)}</td>
                  <td>
                    <Link href={`/dossiers/${item.dossier_id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
                      Régénérer
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p className="muted" style={{ fontSize: 12.5, marginTop: 16, lineHeight: 1.6 }}>
        Les liens de téléchargement sont temporaires par sécurité. Régénérez le document depuis son
        dossier pour obtenir un nouveau lien.
      </p>
    </>
  );
}
