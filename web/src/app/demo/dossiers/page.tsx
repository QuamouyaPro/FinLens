import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { initiale } from "@/lib/format";
import { niveauRisque, libelleRisque } from "@/lib/offres";
import { DOSSIERS, estDetaille } from "@/lib/demo";

export const metadata: Metadata = { title: "Dossiers (démo) — FinLens" };

const STATUTS: Record<string, [string, string]> = {
  ready: ["badge--ok", "Analyse prête"],
  progress: ["badge--warn", "Analyse en cours"],
  new: ["badge--info", "Indexation"],
};

export default function DemoDossiersPage() {
  const actifs = DOSSIERS.filter((d) => d.state === "active");
  const archives = DOSSIERS.filter((d) => d.state === "archived");

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dossiers</h1>
          <p>Vos espaces de travail par entreprise étudiée — la pastille indique le score de risque.</p>
        </div>
        <span className="btn btn--ghost" title="Créez un compte pour ajouter vos propres dossiers">
          <Icon name="lock" style={{ width: 14, height: 14 }} />
          Nouveau dossier
        </span>
      </div>

      <div className="toolbar">
        <div className="chips">
          <span className="chip is-active">
            Actifs<span className="mono">{actifs.length}</span>
          </span>
          <span className="chip">
            Archivés<span className="mono">{archives.length}</span>
          </span>
          <span className="chip">
            Corbeille<span className="mono">0</span>
          </span>
        </div>
      </div>

      {actifs.map((dossier) => {
        const [classeStatut, libelleStatut] = STATUTS[dossier.status] ?? STATUTS.ready;
        return (
          <div className="d-row" key={dossier.id}>
            <Link href={`/demo/dossiers/${dossier.id}`} className="thumb" aria-label={`Ouvrir ${dossier.name}`}>
              {initiale(dossier.name)}
            </Link>
            <Link href={`/demo/dossiers/${dossier.id}`} className="meta">
              <div className="t">
                {dossier.name}
                <span className={`badge ${classeStatut}`}>{libelleStatut}</span>
                {!estDetaille(dossier.id) ? <span className="badge badge--muted">Aperçu</span> : null}
              </div>
              <div className="s">
                <span>
                  <Icon name="doc" />
                  {dossier.docs} documents
                </span>
                <span>{dossier.type}</span>
                <span>{dossier.sector}</span>
                <span>Complétude {dossier.compl} %</span>
              </div>
            </Link>
            <span className={`risk risk-${niveauRisque(dossier.risk)}`} title={libelleRisque(dossier.risk)}>
              {dossier.risk}
            </span>
            <span className="when">{dossier.when}</span>
          </div>
        );
      })}

      {archives.length ? (
        <>
          <div className="block-h" style={{ margin: "30px 0 14px" }}>
            <h2 style={{ fontSize: 16 }}>Archivés</h2>
            <span className="muted" style={{ fontSize: 12.5 }}>
              Rien n&apos;est supprimé — restaurables à tout moment
            </span>
          </div>
          {archives.map((dossier) => (
            <div className="d-row is-archived" key={dossier.id}>
              <span className="thumb">{initiale(dossier.name)}</span>
              <span className="meta">
                <span className="t">{dossier.name}</span>
                <span className="s">
                  <span>{dossier.type}</span>
                  <span>{dossier.sector}</span>
                </span>
              </span>
              <span className={`risk risk-${niveauRisque(dossier.risk)}`}>{dossier.risk}</span>
              <span className="when">{dossier.when}</span>
            </div>
          ))}
        </>
      ) : null}
    </>
  );
}
