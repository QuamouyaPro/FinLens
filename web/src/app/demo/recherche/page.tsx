import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Texte } from "@/components/demo/rendu";
import { RESULTATS_GLOBAUX } from "@/lib/demo";

export const metadata: Metadata = { title: "Recherche globale (démo) — FinLens" };

const SUGGESTIONS = [
  "liquidation préférentielle",
  "covenants bancaires",
  "revenus récurrents",
  "concentration client",
];

export default function DemoRecherchePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Recherche globale</h1>
          <p>Une question, tous vos dossiers actifs — chaque résultat renvoie à sa page exacte.</p>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 12 }}>
        <input
          className="input"
          defaultValue="liquidation préférentielle"
          readOnly
          aria-label="Recherche (démonstration)"
          style={{ height: 52, fontSize: 15.5 }}
        />
      </div>

      <div className="qpacks" style={{ marginBottom: 24 }}>
        <span className="lb">Recherches fréquentes</span>
        {SUGGESTIONS.map((s) => (
          <span className="qpack" key={s} style={{ opacity: 0.6 }}>
            {s}
          </span>
        ))}
      </div>

      <div className="block-h">
        <h2>{RESULTATS_GLOBAUX.length} passages trouvés dans 2 dossiers</h2>
      </div>

      {RESULTATS_GLOBAUX.map((resultat, i) => (
        <Link
          href={`/demo/dossiers/${resultat.id}`}
          className="card"
          key={`${resultat.k}-${i}`}
          style={{ display: "block", marginBottom: 12 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <b style={{ fontSize: 14.5 }}>{resultat.d}</b>
            <span className="src-card" style={{ pointerEvents: "none" }}>
              <span className="pg">{resultat.pg}</span>
              <span className="fn">{resultat.doc}</span>
            </span>
          </div>
          {resultat.q ? (
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
              <Texte>{resultat.q}</Texte>
            </p>
          ) : null}
        </Link>
      ))}

      <p className="muted" style={{ fontSize: 12.5, marginTop: 18, display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="shield" style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Démonstration : résultats préconstruits. Dans un vrai espace, la recherche interroge vos
        propres documents indexés.
      </p>
    </>
  );
}
