import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { initiale } from "@/lib/format";
import { niveauRisque, libelleRisque, TYPES_OPERATION } from "@/lib/offres";
import { DEMO_DOSSIERS } from "@/lib/demo/fixtures";

export const metadata: Metadata = { title: "Dossiers (démo) — FinLens" };

export default function DemoDossiersPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dossiers</h1>
          <p>Vos espaces de travail par entreprise étudiée — la pastille indique le score de risque.</p>
        </div>
        <span className="btn btn--ghost" aria-disabled title="Créez un compte pour ajouter vos propres dossiers">
          <Icon name="lock" style={{ width: 14, height: 14 }} />
          Nouveau dossier
        </span>
      </div>

      <div className="toolbar">
        <div className="search" style={{ cursor: "default", opacity: 0.6 }}>
          <Icon name="srch" />
          <span style={{ fontSize: 13.5 }}>Filtrer par nom ou secteur…</span>
        </div>
        <div className="chips">
          <span className="chip is-active">
            Actifs<span className="mono">{DEMO_DOSSIERS.length}</span>
          </span>
          <span className="chip">
            Archivés<span className="mono">0</span>
          </span>
          <span className="chip">
            Corbeille<span className="mono">0</span>
          </span>
        </div>
      </div>

      {DEMO_DOSSIERS.map((dossier) => (
        <div className="d-row" key={dossier.id}>
          <Link href={`/demo/dossiers/${dossier.id}`} className="thumb" aria-label={`Ouvrir ${dossier.name}`}>
            {initiale(dossier.name)}
          </Link>
          <Link href={`/demo/dossiers/${dossier.id}`} className="meta">
            <div className="t">
              {dossier.name}
              {!dossier.approfondi ? <span className="badge badge--muted">Aperçu</span> : null}
            </div>
            <div className="s">
              <span>
                <Icon name="doc" />
                {dossier.nb_documents} documents
              </span>
              <span>{TYPES_OPERATION[dossier.type_operation]}</span>
              <span>{dossier.sector}</span>
            </div>
          </Link>
          <span className={`risk risk-${niveauRisque(dossier.risk_score)}`} title={libelleRisque(dossier.risk_score)}>
            {dossier.risk_score}
          </span>
          <span className="when">{dossier.updated_at_label}</span>
        </div>
      ))}
    </>
  );
}
