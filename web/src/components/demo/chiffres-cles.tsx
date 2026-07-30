"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { CarteSource } from "./rendu";
import { Texte } from "./rendu";
import type { Etats, LigneEtat } from "@/lib/demo/types";

function Ligne({ ligne, nbAnnees }: { ligne: LigneEtat; nbAnnees: number }) {
  const classes = [ligne.bold ? "subtotal" : "", ligne.indent ? "indent" : ""].filter(Boolean).join(" ");

  return (
    <tr className={classes || undefined}>
      <td>{ligne.l}</td>
      {ligne.v.slice(0, nbAnnees).map((valeur, i) => (
        <td className="mono" key={i}>
          {valeur}
        </td>
      ))}
      <td className={ligne.c === "up" ? "better" : undefined} style={ligne.c === "down" ? { color: "var(--danger)" } : undefined}>
        {ligne.d ?? "—"}
      </td>
      <td className="src-cell">
        {ligne.src ? (
          <CarteSource cle={ligne.src} />
        ) : ligne.est ? (
          <span className="badge badge--muted" title="Complété par recoupement, faute de détail plus fin dans les documents">
            estimé
          </span>
        ) : null}
      </td>
    </tr>
  );
}

function Tableau({
  titre,
  lignes,
  etats,
}: {
  titre: string;
  lignes: LigneEtat[];
  etats: Etats;
}) {
  return (
    <>
      <div className="block-h" style={{ margin: "26px 0 13px" }}>
        <h2 style={{ fontSize: 16 }}>{titre}</h2>
        <span className="muted" style={{ fontSize: 12.5 }}>
          En {etats.unit}
        </span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Poste</th>
            {etats.years.map((annee) => (
              <th scope="col" key={annee}>
                {annee}
              </th>
            ))}
            <th scope="col">Évolution</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <Ligne ligne={ligne} nbAnnees={etats.years.length} key={`${ligne.l}-${i}`} />
          ))}
        </tbody>
      </table>
    </>
  );
}

/**
 * Chiffres clés (Note de fonctionnement, section 8) : le moteur croise les
 * pièces indexées et reconstruit le compte de résultat, le bilan et le tableau
 * de flux. Deux niveaux de lecture — vue simplifiée par défaut, états complets
 * au clic. Chaque ligne est soit sourcée à la page, soit marquée « estimé ».
 */
export function ChiffresCles({ etats }: { etats: Etats | null }) {
  const [complet, setComplet] = useState(false);

  if (!etats) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="tbl" />
        </div>
        <b>Pas encore d&apos;états financiers pour ce dossier</b>
        Déposez un bilan, un compte de résultat ou une liasse : FinLens reconstruit les tableaux et
        relie chaque cellule à sa page d&apos;origine.
      </div>
    );
  }

  return (
    <>
      <div className="note-banner">
        <Icon name="shield" />
        <span>
          Chaque ligne porte sa source : une puce de page quand la donnée figure telle quelle dans un
          document, un badge <b>estimé</b> quand elle est reconstituée par recoupement pour équilibrer
          l&apos;état. Aucune valeur n&apos;est inventée.
        </span>
      </div>

      <div className="block-h">
        <h2>{complet ? "États financiers complets" : "Vue simplifiée"}</h2>
        <button type="button" onClick={() => setComplet((o) => !o)}>
          {complet ? "Revenir à la vue simplifiée" : "Afficher les états complets"}
        </button>
      </div>

      <p className="muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
        Reconstruit depuis : {etats.docSet}
      </p>

      {!complet ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Indicateur</th>
              {etats.years.map((annee) => (
                <th scope="col" key={annee}>
                  {annee}
                </th>
              ))}
              <th scope="col">Évolution</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {etats.simple.map((ligne, i) => (
              <Ligne ligne={ligne} nbAnnees={etats.years.length} key={`${ligne.l}-${i}`} />
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <Tableau titre="Compte de résultat" lignes={etats.compteResultat} etats={etats} />
          <Tableau titre="Bilan — Actif" lignes={etats.bilanActif} etats={etats} />
          <Tableau titre="Bilan — Passif" lignes={etats.bilanPassif} etats={etats} />
          <Tableau titre="Tableau de flux de trésorerie" lignes={etats.fluxTresorerie} etats={etats} />

          <div className="block-h" style={{ margin: "32px 0 14px" }}>
            <h2 style={{ fontSize: 16 }}>Analyse des évolutions</h2>
          </div>
          {etats.evolutions.map((evolution) => (
            <div className="card" style={{ marginBottom: 12 }} key={evolution.t}>
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{evolution.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-soft)" }}>
                <Texte>{evolution.b}</Texte>
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
