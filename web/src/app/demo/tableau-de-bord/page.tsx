import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { initiale } from "@/lib/format";
import { niveauRisque } from "@/lib/offres";
import { DOSSIERS_ACTIFS, SIGNAUX, ETAPES, DOCUMENTS_MANQUANTS } from "@/lib/demo";

export const metadata: Metadata = { title: "Tableau de bord (démo) — FinLens" };

export default function DemoTableauDeBordPage() {
  const critiques = SIGNAUX.filter((s) => s.lvl === "crit" && s.unread);
  const aSurveiller = SIGNAUX.filter((s) => s.lvl === "warn" && s.unread);
  const incomplets = DOSSIERS_ACTIFS.filter((d) => DOCUMENTS_MANQUANTS[d.id]?.length);

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
        <Link href="/demo/signaux">Tous les signaux</Link>
      </div>
      <div className="prio">
        {critiques.map((signal) => (
          <Link href={`/demo/dossiers/${signal.dossier}`} className="prio__i crit" key={signal.id}>
            <span className="ic">
              <Icon name="split" />
            </span>
            <span className="tx">
              <span className="t">{signal.title}</span>
              <span className="s">{signal.dn}</span>
            </span>
            <span className="go">
              Arbitrer
              <Icon name="split" />
            </span>
          </Link>
        ))}

        {aSurveiller.slice(0, 1).map((signal) => (
          <Link href={`/demo/dossiers/${signal.dossier}`} className="prio__i warn" key={signal.id}>
            <span className="ic">
              <Icon name="alert" />
            </span>
            <span className="tx">
              <span className="t">{signal.title}</span>
              <span className="s">{signal.dn}</span>
            </span>
            <span className="go">
              Voir
              <Icon name="split" />
            </span>
          </Link>
        ))}

        {incomplets.slice(0, 1).map((dossier) => (
          <Link href={`/demo/dossiers/${dossier.id}`} className="prio__i info" key={dossier.id}>
            <span className="ic">
              <Icon name="doc" />
            </span>
            <span className="tx">
              <span className="t">
                {DOCUMENTS_MANQUANTS[dossier.id].length} documents manquants — {dossier.name}
              </span>
              <span className="s">{DOCUMENTS_MANQUANTS[dossier.id][0][1]}</span>
            </span>
            <span className="go">
              Compléter
              <Icon name="dl" />
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
            {DOSSIERS_ACTIFS.length}
            <small> / 15</small>
          </div>
          <div className="delta flat">Archivez pour libérer un emplacement</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="lens" />
            Analyses ce mois
          </div>
          <div className="val">
            14<span className="inf"> illimité</span>
          </div>
          <div className="delta up">+4 vs mois dernier</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="chat" />
            Questions posées
          </div>
          <div className="val">
            213<span className="inf"> illimité</span>
          </div>
          <div className="delta up">Aucun dépassement facturé</div>
        </div>
        <div className="kpi">
          <div className="lbl">
            <Icon name="clock" />
            Temps économisé
          </div>
          <div className="val">
            137<small> h</small>
          </div>
          <div className="delta up">Estimé sur les analyses du mois</div>
        </div>
      </div>

      <div className="block-h">
        <h2>Pipeline</h2>
      </div>
      <div className="pipe">
        {ETAPES.map(([cle, label, couleur]) => {
          const nb = DOSSIERS_ACTIFS.filter((d) => d.stage === cle).length;
          return (
            <Link href="/demo/dossiers" className="st" key={cle}>
              <div className="n">
                <i style={{ background: couleur }} />
                {label}
              </div>
              <div className="c">{nb}</div>
              <div className="m">dossier{nb > 1 ? "s" : ""}</div>
            </Link>
          );
        })}
      </div>

      <div className="block-h">
        <h2>Reprendre</h2>
        <Link href="/demo/dossiers">Tous les dossiers</Link>
      </div>

      {DOSSIERS_ACTIFS.map((dossier) => (
        <Link href={`/demo/dossiers/${dossier.id}`} className="d-row" key={dossier.id}>
          <span className="thumb">{initiale(dossier.name)}</span>
          <span className="meta">
            <span className="t">{dossier.name}</span>
            <span className="s">
              <span>
                <Icon name="doc" />
                {dossier.docs} documents
              </span>
              <span>{dossier.type}</span>
              <span>{dossier.sector}</span>
            </span>
          </span>
          <span className={`risk risk-${niveauRisque(dossier.risk)}`}>{dossier.risk}</span>
          <span className="when">{dossier.when}</span>
        </Link>
      ))}
    </>
  );
}
