import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { CarteSource } from "@/components/demo/rendu";
import { SIGNAUX } from "@/lib/demo";

export const metadata: Metadata = { title: "Signaux (démo) — FinLens" };

const STYLES = {
  crit: { classe: "badge--crit", fond: "var(--danger-tint)", texte: "var(--danger)", label: "Critique" },
  warn: { classe: "badge--warn", fond: "var(--signal-tint)", texte: "var(--signal)", label: "À surveiller" },
  info: { classe: "badge--info", fond: "var(--info-tint)", texte: "var(--info)", label: "Information" },
} as const;

export default function DemoSignauxPage() {
  const nonLus = SIGNAUX.filter((s) => s.unread).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Signaux</h1>
          <p>
            Toutes les alertes détectées dans vos dossiers, réunies au même endroit — {nonLus} non
            traités.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="chips">
          <span className="chip is-active">
            Tous<span className="mono">{SIGNAUX.length}</span>
          </span>
          <span className="chip">
            Non traités<span className="mono">{nonLus}</span>
          </span>
          <span className="chip">
            Critiques<span className="mono">{SIGNAUX.filter((s) => s.lvl === "crit").length}</span>
          </span>
        </div>
      </div>

      {SIGNAUX.map((signal) => {
        const style = STYLES[signal.lvl];
        return (
          <Link
            href={`/demo/dossiers/${signal.dossier}`}
            className={`sig${signal.unread ? " unread" : ""}`}
            key={signal.id}
            style={{ marginBottom: 11, display: "flex" }}
          >
            <span className="sic" style={{ background: style.fond, color: style.texte }}>
              <Icon name={signal.lvl === "info" ? "doc" : "split"} />
            </span>

            <span className="sc">
              <span className="st">
                {signal.title}
                <span className={`badge ${style.classe}`}>{style.label}</span>
              </span>
              <span className="sd">{signal.desc}</span>
              {signal.src.length ? (
                <span className="sources__list" style={{ marginTop: 10 }}>
                  {signal.src.map(([cle, , libelle]) => (
                    <CarteSource cle={cle} libelle={libelle} key={cle} />
                  ))}
                </span>
              ) : null}
              <span className="muted" style={{ fontSize: 12, marginTop: 8, display: "block" }}>
                {signal.dn}
              </span>
            </span>

            <span style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
              {signal.when}
            </span>
          </Link>
        );
      })}
    </>
  );
}
