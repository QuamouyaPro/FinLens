"use client";

import { useState } from "react";
import type { Enums } from "@/types/database";

type Props = {
  offre: Enums<"offre">;
  libelle: string;
  variante?: "primary" | "ghost";
  siegesSupplementaires?: number;
};

/**
 * Ouvre Stripe Checkout pour l'offre choisie. Le paiement se fait entièrement
 * chez Stripe — aucune donnée de carte ne transite par FinLens.
 */
export function BoutonCheckout({ offre, libelle, variante = "primary", siegesSupplementaires }: Props) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function demarrer() {
    setEnCours(true);
    setErreur(null);

    try {
      const reponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offre, sieges_supplementaires: siegesSupplementaires }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok || !donnees.checkout_url) {
        setErreur(donnees.error ?? "Impossible d'ouvrir le paiement pour le moment.");
        return;
      }

      window.location.href = donnees.checkout_url;
    } catch {
      setErreur("Connexion interrompue. Réessayez.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn btn--${variante}${variante === "ghost" ? "" : ""} btn--block`}
        onClick={demarrer}
        disabled={enCours}
      >
        {enCours ? "Ouverture du paiement…" : libelle}
      </button>
      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "9px 12px", marginTop: 10, display: "block", lineHeight: 1.5 }}
        >
          {erreur}
        </p>
      ) : null}
    </>
  );
}
