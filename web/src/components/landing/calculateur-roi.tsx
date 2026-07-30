"use client";

import { useState } from "react";
import { euros } from "@/lib/format";
import { OFFRES } from "@/lib/offres";

/** Part du temps de lecture que FinLens reprend — la décision reste humaine. */
const PART_REPRISE = 0.7;

export function CalculateurRoi() {
  const [dossiers, setDossiers] = useState(12);
  const [heures, setHeures] = useState(14);
  const [coutHoraire, setCoutHoraire] = useState(65);

  const heuresParMois = dossiers * heures;
  const coutMensuel = heuresParMois * coutHoraire;
  const economieMensuelle = coutMensuel * PART_REPRISE;
  const abonnementAnnuel = OFFRES.analyste.prixMensuel * 12;
  const netAnnuel = economieMensuelle * 12 - abonnementAnnuel;
  const multiple = (economieMensuelle * 12) / abonnementAnnuel;

  const seuilNonAtteint = netAnnuel <= 0;

  return (
    <div className="roi">
      <div className="roi__in">
        <h3>Votre situation</h3>
        <p className="h">Trois paramètres suffisent.</p>

        <div className="roi-field">
          <div className="rl">
            <label htmlFor="roi-dossiers">Dossiers analysés par mois</label>
            <b>{dossiers}</b>
          </div>
          <input
            id="roi-dossiers"
            type="range"
            min={1}
            max={60}
            value={dossiers}
            onChange={(e) => setDossiers(Number(e.target.value))}
          />
          <div className="rh">
            <span>1</span>
            <span>60</span>
          </div>
        </div>

        <div className="roi-field">
          <div className="rl">
            <label htmlFor="roi-heures">Heures de lecture par dossier</label>
            <b>{heures} h</b>
          </div>
          <input
            id="roi-heures"
            type="range"
            min={2}
            max={40}
            value={heures}
            onChange={(e) => setHeures(Number(e.target.value))}
          />
          <div className="rh">
            <span>2 h</span>
            <span>40 h</span>
          </div>
        </div>

        <div className="roi-field">
          <div className="rl">
            <label htmlFor="roi-cout">Coût horaire chargé de l&apos;analyste</label>
            <b>{coutHoraire} €</b>
          </div>
          <input
            id="roi-cout"
            type="range"
            min={25}
            max={250}
            step={5}
            value={coutHoraire}
            onChange={(e) => setCoutHoraire(Number(e.target.value))}
          />
          <div className="rh">
            <span>25 €</span>
            <span>250 €</span>
          </div>
        </div>

        <p className="faint" style={{ fontSize: 12, lineHeight: 1.55 }}>
          Hypothèse retenue : FinLens absorbe environ 70 % du temps de lecture et de synthèse. La
          validation, le jugement et la décision restent humains.
        </p>
      </div>

      <div className="roi__out noise">
        <div className="k">Économie nette annuelle</div>

        {seuilNonAtteint ? (
          <>
            <div className="roi__big">
              <small style={{ fontSize: 22 }}>Seuil non atteint</small>
            </div>
            <div className="roi__sub">
              À ce volume, l&apos;offre Essentiel à {OFFRES.essentiel.prixMensuel} €/mois est plus adaptée
              que l&apos;offre Analyste. Le seuil de rentabilité se situe autour de 15 heures de lecture
              facturées par mois.
            </div>
          </>
        ) : (
          <>
            <div className="roi__big">
              {euros(Math.round(netAnnuel))}
              <small> / an</small>
            </div>
            <div className="roi__sub">
              Soit {Math.round(heuresParMois * PART_REPRISE)} heures d&apos;analyste libérées chaque mois,
              réaffectées au sourcing, à la négociation et à la décision.
            </div>
          </>
        )}

        <div className="roi__lines">
          <div>
            <span>Coût actuel de lecture</span>
            <b>− {euros(Math.round(coutMensuel * 12))} / an</b>
          </div>
          <div>
            <span>Temps repris par FinLens (70 %)</span>
            <b>+ {euros(Math.round(economieMensuelle * 12))}</b>
          </div>
          <div>
            <span>Abonnement Analyste</span>
            <b>− {euros(abonnementAnnuel)}</b>
          </div>
          <div className="tot">
            <span>Retour sur investissement</span>
            <b>{seuilNonAtteint ? "—" : `×${multiple.toFixed(1)}`}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
