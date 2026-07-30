"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { OFFRES } from "@/lib/offres";

/** Deux mois offerts sur l'engagement annuel. */
const MOIS_FACTURES_ANNUEL = 10;

function prixAffiche(mensuel: number, annuel: boolean) {
  return annuel ? Math.round((mensuel * MOIS_FACTURES_ANNUEL) / 12) : mensuel;
}

export function Tarifs() {
  const [annuel, setAnnuel] = useState(false);

  const economie = (mensuel: number) => mensuel * 2;

  return (
    <>
      <div className="sec-head--center">
        <span className="eyebrow">Tarifs</span>
        <h2>Une offre d&apos;entrée simple. Deux offres pro illimitées.</h2>
        <p className="sub" style={{ margin: "0 auto" }}>
          Sur Analyste et Fonds : dossiers, documents, pages et questions <b>illimités</b>. Le seul
          plafond visible : 15 dossiers ouverts en même temps.
        </p>
        <div className="bill-toggle" role="group" aria-label="Périodicité de facturation">
          <button
            type="button"
            className={!annuel ? "is-active" : ""}
            onClick={() => setAnnuel(false)}
            aria-pressed={!annuel}
          >
            Mensuel
          </button>
          <button
            type="button"
            className={annuel ? "is-active" : ""}
            onClick={() => setAnnuel(true)}
            aria-pressed={annuel}
          >
            Annuel<span className="save">−2 mois</span>
          </button>
        </div>
      </div>

      <div className="pricing">
        <div className="plan reveal">
          <span className="plan__tag">Essentiel</span>
          <h3>Pour découvrir</h3>
          <div className="price">
            {prixAffiche(OFFRES.essentiel.prixMensuel, annuel)} €<small> / mois</small>
          </div>
          <div className="save-line">
            {annuel ? `Soit ${economie(OFFRES.essentiel.prixMensuel)} € économisés par an` : ""}
          </div>
          <p className="sub">Étudiants, veille personnelle, besoins ponctuels légers.</p>
          <ul>
            <li>
              <Icon name="check" />4 dossiers actifs simultanés, gardés sans limite de durée
            </li>
            <li>
              <Icon name="check" />3 nouvelles analyses de dossier / mois
            </li>
            <li>
              <Icon name="check" />
              100 questions au Copilote / mois
            </li>
            <li>
              <Icon name="check" />
              Exports illimités (PDF, Word)
            </li>
            <li className="no">
              <Icon name="cross" />
              Comparateur &amp; détection de contradictions
            </li>
          </ul>
          <Link href="/inscription" className="btn btn--ghost btn--block">
            Commencer
          </Link>
          <p className="foot">
            Quotas fermes, remis à zéro à chaque prélèvement. La consultation des dossiers existants et
            les exports restent toujours accessibles.
          </p>
        </div>

        <div className="plan plan--feat reveal" style={{ "--reveal-delay": "0.07s" } as React.CSSProperties}>
          <span className="plan__flag">Le plus choisi</span>
          <span className="plan__tag">Analyste</span>
          <h3>Illimité, 1 siège</h3>
          <div className="price">
            {prixAffiche(OFFRES.analyste.prixMensuel, annuel)} €<small> / mois</small>
          </div>
          <div className="save-line">
            {annuel ? `Soit ${economie(OFFRES.analyste.prixMensuel)} € économisés par an` : ""}
          </div>
          <p className="sub">Pour l&apos;analyste qui traite du volume en continu, sans compter.</p>
          <ul>
            <li>
              <Icon name="check" />
              <b>Dossiers, documents, pages &amp; questions illimités</b>
            </li>
            <li>
              <Icon name="check" />
              15 dossiers ouverts simultanément — archivage libre
            </li>
            <li>
              <Icon name="check" />
              Comparateur, contradictions &amp; extraction chiffrée
            </li>
            <li>
              <Icon name="check" />
              Score de risque et checklist de due diligence
            </li>
            <li>
              <Icon name="check" />
              Les 6 profils d&apos;analyse
            </li>
          </ul>
          <Link href="/inscription" className="btn btn--primary btn--block">
            Démarrer
          </Link>
          <p className="foot">
            Aucun compteur de questions, aucun dépassement facturé. Archiver un dossier libère un
            emplacement instantanément, sans rien effacer.
          </p>
        </div>

        <div className="plan reveal" style={{ "--reveal-delay": "0.14s" } as React.CSSProperties}>
          <span className="plan__tag">Fonds</span>
          <h3>Équipe, sur devis</h3>
          <div className="price">
            {prixAffiche(OFFRES.fonds.prixMensuel, annuel).toLocaleString("fr-FR")} €
            <small> dès / mois</small>
          </div>
          <div className="save-line">
            {annuel ? `Soit ${economie(OFFRES.fonds.prixMensuel).toLocaleString("fr-FR")} € économisés par an` : ""}
          </div>
          <p className="sub">5 sièges inclus (580 €/siège). Un siège = une personne nommée.</p>
          <ul>
            <li>
              <Icon name="check" />
              Tout Analyste, <b>par siège</b> (illimité, 15 dossiers/siège)
            </li>
            <li>
              <Icon name="check" />
              Sièges additionnels : 580 €/mois jusqu&apos;au 10ᵉ
            </li>
            <li>
              <Icon name="check" />
              630 €/mois au-delà du 10ᵉ siège
            </li>
            <li>
              <Icon name="check" />
              Partage de dossiers &amp; annotations d&apos;équipe
            </li>
            <li>
              <Icon name="check" />
              Onboarding &amp; support dédiés
            </li>
          </ul>
          <a href="mailto:contact@finlens.fr?subject=Demande%20de%20devis%20FinLens%20Fonds" className="btn btn--ghost btn--block">
            Demander un devis
          </a>
          <p className="foot">
            Facturation à la personne, contrat annuel ou mensuel. Ajout et retrait de sièges à tout
            moment.
          </p>
        </div>
      </div>
    </>
  );
}
