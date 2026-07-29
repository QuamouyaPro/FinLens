import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY doit être défini (voir .env.example).");
  }

  stripeClient = new Stripe(apiKey);
  return stripeClient;
}

/**
 * Price IDs Stripe des 3 offres (Coûts & Pricing, section 7). À créer côté
 * Dashboard Stripe puis renseigner en variables d'environnement -- ce backend
 * ne crée jamais de produit Stripe automatiquement.
 */
export const STRIPE_PRICE_IDS = {
  essentiel: process.env.STRIPE_PRICE_ESSENTIEL, // 23 €/mois
  analyste: process.env.STRIPE_PRICE_ANALYSTE, // 690 €/mois, 1 siège
  fonds_siege: process.env.STRIPE_PRICE_FONDS_SIEGE, // 580 €/mois/siège (jusqu'au 10e)
  fonds_siege_palier: process.env.STRIPE_PRICE_FONDS_SIEGE_PALIER, // 630 €/mois/siège au-delà du 10e
} as const;
