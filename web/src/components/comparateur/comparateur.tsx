"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ComparaisonContenu } from "@/types/domain";

export type DossierComparable = { id: string; name: string; analyse: boolean };

export function Comparateur({ dossiers }: { dossiers: DossierComparable[] }) {
  const analysables = dossiers.filter((d) => d.analyse);
  const [gauche, setGauche] = useState(analysables[0]?.id ?? "");
  const [droite, setDroite] = useState(analysables[1]?.id ?? "");
  const [resultat, setResultat] = useState<ComparaisonContenu | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function comparer() {
    if (!gauche || !droite || gauche === droite) {
      setErreur("Choisissez deux dossiers différents.");
      return;
    }

    setEnCours(true);
    setErreur(null);
    setResultat(null);

    try {
      const reponse = await fetch("/api/comparaisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossier_ids: [gauche, droite] }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.error ?? "La comparaison a échoué.");
        return;
      }

      setResultat(donnees.comparison.contenu_json as ComparaisonContenu);
    } catch {
      setErreur("Connexion interrompue. Relancez la comparaison.");
    } finally {
      setEnCours(false);
    }
  }

  if (analysables.length < 2) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="split" />
        </div>
        <b>Il faut deux dossiers analysés pour comparer</b>
        La comparaison s&apos;appuie sur l&apos;extraction de chaque dossier. Analysez au moins deux
        dossiers, puis revenez ici.
      </div>
    );
  }

  const nomGauche = analysables.find((d) => d.id === gauche)?.name ?? "";
  const nomDroite = analysables.find((d) => d.id === droite)?.name ?? "";

  return (
    <>
      <div className="cmp-pick">
        <div className="cmp-slot">
          <label htmlFor="cmp-gauche">Premier dossier</label>
          <select
            id="cmp-gauche"
            className="select"
            value={gauche}
            onChange={(e) => setGauche(e.target.value)}
          >
            {analysables.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <span className="vs">vs</span>

        <div className="cmp-slot">
          <label htmlFor="cmp-droite">Second dossier</label>
          <select
            id="cmp-droite"
            className="select"
            value={droite}
            onChange={(e) => setDroite(e.target.value)}
          >
            {analysables.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" className="btn btn--primary" onClick={comparer} disabled={enCours}>
        <Icon name="split" style={{ width: 15, height: 15 }} />
        {enCours ? "Comparaison en cours…" : "Comparer"}
      </button>

      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "11px 15px", margin: "18px 0", display: "block", lineHeight: 1.55 }}
        >
          {erreur}
        </p>
      ) : null}

      {resultat ? (
        <div style={{ marginTop: 26 }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Indicateur</th>
                <th scope="col">{nomGauche}</th>
                <th scope="col">{nomDroite}</th>
              </tr>
            </thead>
            <tbody>
              {resultat.lignes.map((ligne, index) => {
                const valeurs = Object.values(ligne.valeurs);
                return (
                  <tr key={`${ligne.indicateur}-${index}`}>
                    <td>{ligne.indicateur}</td>
                    <td className="mono">{valeurs[0] ?? "—"}</td>
                    <td className="mono">{valeurs[1] ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {resultat.synthese ? (
            <div className="card" style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Lecture croisée</h3>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.65 }}>
                {resultat.synthese}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
