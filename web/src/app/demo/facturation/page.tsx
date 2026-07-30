import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { euros } from "@/lib/format";
import { OFFRES } from "@/lib/offres";
import { DOSSIERS_ACTIFS } from "@/lib/demo";

export const metadata: Metadata = { title: "Facturation (démo) — FinLens" };

const FACTURES = [
  { date: "01/07/2026", montant: 2900, statut: "Payée" },
  { date: "01/06/2026", montant: 2900, statut: "Payée" },
  { date: "01/05/2026", montant: 2900, statut: "Payée" },
];

export default function DemoFacturationPage() {
  const config = OFFRES.fonds;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Facturation</h1>
          <p>Votre offre, ce qu&apos;elle inclut, et ce qu&apos;il vous reste ce mois-ci.</p>
        </div>
      </div>

      <div className="plan-card noise">
        <div className="pc-l">
          <h3>
            FinLens Fonds
            <span className="badge badge--ink">Offre active</span>
          </h3>
          <p>
            Dossiers, documents, pages et questions illimités · 15 dossiers ouverts par siège · 5
            sièges nommés
          </p>
        </div>
        <div className="pc-price">
          {euros(config.prixMensuel)}
          <small> / mois</small>
        </div>
      </div>

      <div className="note-banner">
        <Icon name="lens" />
        <span>
          Aucun compteur de questions, aucun dépassement facturé. Le seul plafond visible est le
          nombre de dossiers ouverts en même temps — archivez un dossier terminé pour en libérer un.
        </span>
      </div>

      <div className="unl">
        <div className="u">
          <div className="l">Dossiers analysés</div>
          <div className="v">Illimité</div>
        </div>
        <div className="u">
          <div className="l">Questions au Copilote</div>
          <div className="v">Illimité</div>
        </div>
        <div className="u">
          <div className="l">Pages par document</div>
          <div className="v">Illimité</div>
        </div>
        <div className="u">
          <div className="l">Dossiers ouverts</div>
          <div className="v n">{DOSSIERS_ACTIFS.length} / 15</div>
        </div>
      </div>

      <div className="block-h" style={{ margin: "30px 0 14px" }}>
        <h2>Historique de facturation</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Montant</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {FACTURES.map((facture) => (
            <tr key={facture.date}>
              <td>{facture.date}</td>
              <td className="mono">{euros(facture.montant)}</td>
              <td>
                <span className="badge badge--ok">{facture.statut}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-banner" style={{ marginTop: 22 }}>
        <Icon name="card" />
        <span>
          Démonstration : ces factures sont fictives. Le paiement réel passe par Stripe, aucune donnée
          de carte ne transite par FinLens.
        </span>
      </div>

      <Link href="/inscription" className="btn btn--primary" style={{ marginTop: 18 }}>
        Créer mon espace
      </Link>
    </>
  );
}
