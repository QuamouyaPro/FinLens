"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

const CONFIRMATION = "SUPPRIMER";

/**
 * Droit à l'effacement en self-service (Note d'Architecture, section H). La
 * suppression est réelle — pas un simple marquage : lignes Supabase supprimées,
 * profil Stripe anonymisé (les factures restent conservées pour les obligations
 * comptables), trace de conformité minimale gardée sans les données effacées.
 */
export function SuppressionCompte() {
  const [ouvert, setOuvert] = useState(false);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function supprimer() {
    setEnCours(true);
    setErreur(null);

    try {
      const reponse = await fetch("/api/erasure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "compte" }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json().catch(() => ({}));
        setErreur(donnees.error ?? "La suppression a échoué.");
        return;
      }

      window.location.href = "/";
    } catch {
      setErreur("Connexion interrompue. Le compte n'a pas été supprimé.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div
      className="card"
      style={{ borderColor: "var(--danger-tint)", background: "var(--danger-wash)" }}
    >
      <h3 style={{ fontSize: 16, marginBottom: 7, color: "var(--danger)" }}>Supprimer mon compte</h3>
      <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
        Votre compte et vos données personnelles sont réellement supprimés, pas seulement masqués : les
        lignes de la base sont effacées, l&apos;index documentaire purgé et votre profil de facturation
        anonymisé. Les factures déjà émises sont conservées, comme l&apos;exige la réglementation
        comptable. Cette action est définitive.
      </p>

      {!ouvert ? (
        <button type="button" className="btn btn--danger" onClick={() => setOuvert(true)}>
          <Icon name="trash" style={{ width: 15, height: 15 }} />
          Supprimer mon compte
        </button>
      ) : (
        <>
          <div className="field">
            <label htmlFor="confirmation-suppression">
              Saisissez <b>{CONFIRMATION}</b> pour confirmer
            </label>
            <input
              id="confirmation-suppression"
              className="input"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder={CONFIRMATION}
              autoComplete="off"
            />
          </div>

          {erreur ? (
            <p
              role="alert"
              className="badge badge--crit"
              style={{ height: "auto", padding: "10px 13px", marginBottom: 14, display: "block", lineHeight: 1.5 }}
            >
              {erreur}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 11 }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setOuvert(false);
                setSaisie("");
                setErreur(null);
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={supprimer}
              disabled={enCours || saisie !== CONFIRMATION}
            >
              {enCours ? "Suppression…" : "Supprimer définitivement"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
