import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { dateRelative } from "@/lib/format";
import type { Enums } from "@/types/database";

export const metadata: Metadata = { title: "Signaux — FinLens" };

const FILTRES = [
  { cle: "tous", label: "Tous" },
  { cle: "non_lus", label: "Non traités" },
  { cle: "critiques", label: "Critiques" },
  { cle: "surveiller", label: "À surveiller" },
] as const;

const STYLES: Record<Enums<"gravite">, { classe: string; couleurFond: string; couleurTexte: string; label: string }> = {
  critique: {
    classe: "badge--crit",
    couleurFond: "var(--danger-tint)",
    couleurTexte: "var(--danger)",
    label: "Critique",
  },
  a_verifier: {
    classe: "badge--warn",
    couleurFond: "var(--signal-tint)",
    couleurTexte: "var(--signal)",
    label: "À vérifier",
  },
  mineur: {
    classe: "badge--info",
    couleurFond: "var(--info-tint)",
    couleurTexte: "var(--info)",
    label: "Information",
  },
};

export default async function SignauxPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre = "tous" } = await searchParams;
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  let requete = supabase
    .from("contradictions")
    .select("id, gravite, description, status, created_at, dossier_id, dossiers!inner(name, status)")
    .eq("organization_id", session.organizationId)
    .neq("dossiers.status", "corbeille")
    .order("created_at", { ascending: false });

  if (filtre === "critiques") requete = requete.eq("gravite", "critique");
  if (filtre === "surveiller") requete = requete.eq("gravite", "a_verifier");
  if (filtre === "non_lus") requete = requete.eq("status", "ouverte");

  const { data: signaux } = await requete;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Signaux</h1>
          <p>Toutes les alertes détectées dans vos dossiers, réunies au même endroit.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="chips">
          {FILTRES.map(({ cle, label }) => (
            <Link
              key={cle}
              href={cle === "tous" ? "/signaux" : `/signaux?filtre=${cle}`}
              className={`chip${filtre === cle ? " is-active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {(signaux ?? []).length === 0 ? (
        <div className="empty">
          <div className="ic">
            <Icon name="check" />
          </div>
          <b>Aucun signal à traiter</b>
          {filtre === "tous"
            ? "Les contradictions entre documents apparaissent ici dès qu'un dossier est analysé."
            : "Aucun signal ne correspond à ce filtre."}
        </div>
      ) : (
        (signaux ?? []).map((signal) => {
          const style = STYLES[signal.gravite];
          const dossier = signal.dossiers as unknown as { name: string };

          return (
            <Link
              href={`/dossiers/${signal.dossier_id}`}
              className={`sig${signal.status === "ouverte" ? " unread" : ""}`}
              key={signal.id}
              style={{ marginBottom: 11, display: "flex" }}
            >
              <span className="sic" style={{ background: style.couleurFond, color: style.couleurTexte }}>
                <Icon name="split" />
              </span>

              <span className="sc">
                <span className="st">
                  {dossier?.name ?? "Dossier"}
                  <span className={`badge ${style.classe}`}>{style.label}</span>
                  {signal.status === "arbitree" ? <span className="badge badge--muted">Arbitré</span> : null}
                </span>
                <span className="sd">{signal.description}</span>
              </span>

              <span className="when" style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                {dateRelative(signal.created_at)}
              </span>
            </Link>
          );
        })
      )}
    </>
  );
}
