import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { CarteSource } from "@/components/demo/rendu";
import { ETATS_FINANCIERS, trouverDossier } from "@/lib/demo";

export const metadata: Metadata = { title: "Comparateur (démo) — FinLens" };

/**
 * Comparateur (Module 4) en démonstration : confronte LVMH et Helios sur leurs
 * indicateurs simplifiés, en reprenant les états financiers déjà reconstruits
 * pour chaque dossier. La dernière année disponible sert de base de comparaison.
 */
export default function DemoComparateurPage() {
  const gauche = trouverDossier("lvmh")!;
  const droite = trouverDossier("helios")!;
  const etatsGauche = ETATS_FINANCIERS.lvmh;
  const etatsDroite = ETATS_FINANCIERS.helios;

  // On aligne sur les libellés présents des deux côtés : deux entreprises de
  // secteurs différents n'exposent pas exactement les mêmes postes.
  const libellesDroite = new Map(etatsDroite.simple.map((l) => [l.l, l]));
  const lignes = etatsGauche.simple
    .map((ligneGauche) => ({ gauche: ligneGauche, droite: libellesDroite.get(ligneGauche.l) }))
    .filter((paire) => paire.droite);

  const propresGauche = etatsGauche.simple.filter((l) => !libellesDroite.has(l.l));
  const libellesGauche = new Set(etatsGauche.simple.map((l) => l.l));
  const propresDroite = etatsDroite.simple.filter((l) => !libellesGauche.has(l.l));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Comparateur</h1>
          <p>Deux dossiers confrontés ligne à ligne, chaque valeur reliée à sa source.</p>
        </div>
      </div>

      <div className="cmp-pick">
        <div className="cmp-slot">
          <label htmlFor="cmp-g">Premier dossier</label>
          <select id="cmp-g" className="select" defaultValue={gauche.id} disabled>
            <option value={gauche.id}>{gauche.name}</option>
          </select>
        </div>
        <span className="vs">vs</span>
        <div className="cmp-slot">
          <label htmlFor="cmp-d">Second dossier</label>
          <select id="cmp-d" className="select" defaultValue={droite.id} disabled>
            <option value={droite.id}>{droite.name}</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Indicateur</th>
            <th scope="col">
              {gauche.name} <span className="muted">({etatsGauche.unit})</span>
            </th>
            <th scope="col">
              {droite.name} <span className="muted">({etatsDroite.unit})</span>
            </th>
            <th scope="col">Sources</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map(({ gauche: lg, droite: ld }) => {
            const dernierG = lg.v[lg.v.length - 1];
            const dernierD = ld!.v[ld!.v.length - 1];
            return (
              <tr key={lg.l}>
                <td>{lg.l}</td>
                <td className="mono">
                  {dernierG}
                  {lg.d ? <span className="muted" style={{ fontSize: 12 }}> · {lg.d}</span> : null}
                </td>
                <td className="mono">
                  {dernierD}
                  {ld!.d ? <span className="muted" style={{ fontSize: 12 }}> · {ld!.d}</span> : null}
                </td>
                <td className="src-cell">
                  {lg.src ? <CarteSource cle={lg.src} /> : null}
                  {ld!.src ? <CarteSource cle={ld!.src} /> : null}
                </td>
              </tr>
            );
          })}

          {propresGauche.length ? (
            <tr className="grp">
              <td colSpan={4}>Propre à {gauche.name}</td>
            </tr>
          ) : null}
          {propresGauche.map((ligne) => (
            <tr key={`g-${ligne.l}`}>
              <td>{ligne.l}</td>
              <td className="mono">{ligne.v[ligne.v.length - 1]}</td>
              <td className="faint">—</td>
              <td className="src-cell">{ligne.src ? <CarteSource cle={ligne.src} /> : null}</td>
            </tr>
          ))}

          {propresDroite.length ? (
            <tr className="grp">
              <td colSpan={4}>Propre à {droite.name}</td>
            </tr>
          ) : null}
          {propresDroite.map((ligne) => (
            <tr key={`d-${ligne.l}`}>
              <td>{ligne.l}</td>
              <td className="faint">—</td>
              <td className="mono">{ligne.v[ligne.v.length - 1]}</td>
              <td className="src-cell">{ligne.src ? <CarteSource cle={ligne.src} /> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Lecture croisée</h3>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          Deux profils de risque opposés : {gauche.name} affiche un levier quasi nul et une génération
          de trésorerie abondante, à un stade de maturité où la question porte sur la trajectoire de
          marge. {droite.name} est à un stade de croissance où la question porte d&apos;abord sur la
          fiabilité des chiffres communiqués — l&apos;écart de chiffre d&apos;affaires entre le teaser
          et l&apos;annexe conditionne toute la valorisation.
        </p>
      </div>

      <p className="muted" style={{ fontSize: 12.5, marginTop: 18, display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="shield" style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Démonstration : la sélection de dossiers est figée. Dans un vrai espace, vous comparez
        n&apos;importe quels dossiers déjà analysés.
      </p>
    </>
  );
}
