import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { initiale } from "@/lib/format";
import { niveauRisque, TYPES_OPERATION } from "@/lib/offres";
import { DEMO_DOSSIERS, DEMO_SIGNAUX } from "@/lib/demo/fixtures";

export const metadata: Metadata = { title: "Tableau de bord (démo) — FinLens" };

export default function DemoTableauDeBordPage() {
  const critiques = DEMO_SIGNAUX.filter((s) => s.gravite === "critique" && s.nonLu);
  const aSurveiller = DEMO_SIGNAUX.filter((s) => s.gravite === "a_verifier" && s.nonLu);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Ce qui demande une décision aujourd&apos;hui, avant les statistiques.</p>
        </div>
      </div>

      <div className="block-h">
        <h2>À traiter en priorité</h2>
      </div>
      <div className="prio">
        {critiques.map((signal) => (
          <Link href={`/demo/dossiers/${signal.dossierId}`} className="prio__i crit" key={signal.id}>
            <span className="ic">
              <Icon name="split" />
            </span>
            <span className="tx">
              <span className="t">
                Contradiction critique — {signal.dossierName}
              </span>
              <span className="s">{signal.titre}</span>
            </span>
            <span className="go">
              Arbitrer
              <Icon name="split" />
            </span>
          </Link>
        ))}
        {aSurveiller.slice(0, 2).map((signal) => (
          <Link href={`/demo/dossiers/${signal.dossierId}`} className="prio__i warn" key={signal.id}>
            <span className="ic">
              <Icon name="alert" />
            </span>
            <span className="tx">
              <span className="t">{signal.titre} — {signal.dossierName}</span>
              <span className="s">{signal.description.slice(0, 100)}…</span>
            </span>
            <span className="go">
              Voir
              <Icon name="split" />
            </span>
          </Link>
        ))}
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="lbl">
            <Icon name="folder" />
            Dossiers ouverts
          </div>
          <div className="val">
            {DEMO_DOSSIERS.length}
            <small> / 15</small>
          </div>
          <div className="delta flat">Démonstration — non modifiable</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="lens" />
            Analyses ce mois
          </div>
          <div className="val">
            6<span className="inf"> illimité</span>
          </div>
          <div className="delta flat">Extraction complète du dossier</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="chat" />
            Questions posées
          </div>
          <div className="val">
            27<span className="inf"> illimité</span>
          </div>
          <div className="delta flat">Ce mois-ci, tous dossiers confondus</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="clock" />
            Temps économisé
          </div>
          <div className="val">
            42<small> h</small>
          </div>
          <div className="delta up">Estimé sur les analyses du mois</div>
        </div>
      </div>

      <div className="block-h">
        <h2>Dossiers récents</h2>
        <Link href="/demo/dossiers">Tous les dossiers</Link>
      </div>

      {DEMO_DOSSIERS.map((dossier) => (
        <Link href={`/demo/dossiers/${dossier.id}`} className="d-row" key={dossier.id}>
          <span className="thumb">{initiale(dossier.name)}</span>
          <span className="meta">
            <span className="t">{dossier.name}</span>
            <span className="s">
              <span>{TYPES_OPERATION[dossier.type_operation]}</span>
              <span>{dossier.sector}</span>
            </span>
          </span>
          <span className={`risk risk-${niveauRisque(dossier.risk_score)}`}>{dossier.risk_score}</span>
          <span className="when">{dossier.updated_at_label}</span>
        </Link>
      ))}
    </>
  );
}
