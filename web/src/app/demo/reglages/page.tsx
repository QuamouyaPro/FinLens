import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Réglages (démo) — FinLens" };

const ALERTES = [
  { label: "Contradiction critique détectée", actif: true },
  { label: "Document manquant identifié", actif: true },
  { label: "Synthèse terminée", actif: true },
  { label: "Récapitulatif hebdomadaire", actif: false },
  { label: "Dossier sans activité depuis 7 jours", actif: false },
];

export default function DemoReglagesPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Réglages</h1>
          <p>Votre compte, votre espace de travail et le traitement de vos documents.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Compte</h3>
        <div className="row2">
          <div className="field">
            <label htmlFor="d-email">Adresse e-mail</label>
            <input id="d-email" className="input" value="camille@meridian.fr" readOnly />
          </div>
          <div className="field">
            <label htmlFor="d-org">Espace de travail</label>
            <input id="d-org" className="input" value="Meridian Capital" readOnly />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="d-offre">Offre</label>
            <input id="d-offre" className="input" value="FinLens Fonds" readOnly />
          </div>
          <div className="field">
            <label htmlFor="d-role">Votre rôle</label>
            <input id="d-role" className="input" value="Propriétaire" readOnly />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Alertes</h3>
        <p className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
          Ce dont FinLens vous prévient, et ce qu&apos;il garde pour le tableau de bord.
        </p>
        {ALERTES.map((alerte) => (
          <label className="doc-item" key={alerte.label} style={{ alignItems: "center" }}>
            <input
              type="checkbox"
              defaultChecked={alerte.actif}
              disabled
              style={{ width: 17, height: 17, accentColor: "var(--accent)", flex: "none" }}
            />
            <span className="info">
              <span className="n">{alerte.label}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 7 }}>Confidentialité de vos documents</h3>
        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.65, marginBottom: 18 }}>
          Ce qui arrive concrètement aux pièces que vous déposez.
        </p>

        <div className="trust" style={{ gridTemplateColumns: "1fr", gap: 12, marginTop: 0 }}>
          <div className="t">
            <div className="ic">
              <Icon name="shield" />
            </div>
            <div>
              <b>Cloisonnés par espace de travail</b>
              <p>
                Vos documents ne sont accessibles qu&apos;aux membres de votre organisation, appliqué
                au niveau de la base de données elle-même.
              </p>
            </div>
          </div>
          <div className="t">
            <div className="ic">
              <Icon name="lens" />
            </div>
            <div>
              <b>Jamais utilisés pour entraîner un modèle public</b>
              <p>
                L&apos;analyse passe par l&apos;API Anthropic sous contrat commercial : vos contenus
                n&apos;alimentent aucun entraînement.
              </p>
            </div>
          </div>
          <div className="t">
            <div className="ic">
              <Icon name="bank" />
            </div>
            <div>
              <b>Hébergés en Union européenne</b>
              <p>
                Base de données et stockage en région Francfort (eu-central-1). Seul le flux
                d&apos;analyse sort de l&apos;UE, encadré contractuellement.
              </p>
            </div>
          </div>
          <div className="t">
            <div className="ic">
              <Icon name="trash" />
            </div>
            <div>
              <b>Suppression réelle, avec 30 jours pour changer d&apos;avis</b>
              <p>
                Un dossier supprimé part en corbeille 30 jours, puis est purgé de la base et de
                l&apos;index documentaire.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="note-banner">
        <Icon name="lock" />
        <span>
          Démonstration : ces réglages ne sont pas modifiables. Créez un espace pour configurer vos
          propres alertes et gérer vos données.
        </span>
      </div>

      <Link href="/inscription" className="btn btn--primary" style={{ marginTop: 18 }}>
        Créer mon espace
      </Link>
    </>
  );
}
