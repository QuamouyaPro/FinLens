import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { DEMO_SIGNAUX } from "@/lib/demo/fixtures";

export const metadata: Metadata = { title: "Signaux (démo) — FinLens" };

const STYLES = {
  critique: { classe: "badge--crit", fond: "var(--danger-tint)", texte: "var(--danger)", label: "Critique" },
  a_verifier: { classe: "badge--warn", fond: "var(--signal-tint)", texte: "var(--signal)", label: "À vérifier" },
  info: { classe: "badge--info", fond: "var(--info-tint)", texte: "var(--info)", label: "Information" },
} as const;

export default function DemoSignauxPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Signaux</h1>
          <p>Toutes les alertes détectées dans vos dossiers, réunies au même endroit.</p>
        </div>
      </div>

      {DEMO_SIGNAUX.map((signal) => {
        const style = STYLES[signal.gravite];
        return (
          <Link
            href={`/demo/dossiers/${signal.dossierId}`}
            className={`sig${signal.nonLu ? " unread" : ""}`}
            key={signal.id}
            style={{ marginBottom: 11, display: "flex" }}
          >
            <span className="sic" style={{ background: style.fond, color: style.texte }}>
              <Icon name="split" />
            </span>
            <span className="sc">
              <span className="st">
                {signal.dossierName}
                <span className={`badge ${style.classe}`}>{style.label}</span>
              </span>
              <span className="sd">{signal.description}</span>
            </span>
            <span className="when" style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
              {signal.quand}
            </span>
          </Link>
        );
      })}
    </>
  );
}
