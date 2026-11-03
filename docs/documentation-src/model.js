"use strict";
/**
 * Modèle financier de la collection documentaire FinLens.
 * Toutes les données d'entrée proviennent de « FinLens — Coûts & Pricing » (docs/)
 * ou du code (web/src/lib/offres.ts, lib/ai/models.ts). Les chiffres dérivés sont
 * CALCULÉS ici — jamais saisis à la main — pour que tableaux et graphiques concordent.
 * Hypothèse de conversion reprise de la source : 1 $ ≈ 1 €.
 */

/* ----------------------------- entrées sourcées ---------------------------- */
const PRIX = { essentiel: 23, analyste: 690, fonds_5_sieges: 2900, siege_fonds: 580, siege_fonds_palier: 630 };
const STRIPE = { pct: 0.015, fixe: 0.25 }; // ~1,5 % + 0,25 € / transaction (Coûts & Pricing §1)
const TVA = 0.2;

const COUT = {
  extraction: 4.5, // Fable 5, ~300k in + ~20k out
  reformulation6: 0.275, // 0,25 à 0,30 $ pour les 6 profils
  reformulation3: 0.14, // 0,13 à 0,15 $ pour les 3 profils
  question_min: 0.02,
  question_max: 0.06,
  comparaison: 6,
};

/** Surcoût du pipeline ACTUEL : la détection de contradictions relit le corpus complet sur Fable 5. */
const CONTRADICTIONS = {
  tokens_in_corpus: 300_000, // même hypothèse que l'extraction (dossier de ~300 pages)
  tokens_out: 2_000,
  prix_in: 10, // $/M
  prix_out: 50, // $/M
  /** cible V2 : lecture de l'extraction structurée (~20k tokens) au lieu du corpus */
  tokens_in_extraction: 20_000,
  tokens_out_v2: 4_096,
};
const contradictionsActuel =
  (CONTRADICTIONS.tokens_in_corpus * CONTRADICTIONS.prix_in + CONTRADICTIONS.tokens_out * CONTRADICTIONS.prix_out) / 1e6;
const contradictionsV2 =
  (CONTRADICTIONS.tokens_in_extraction * CONTRADICTIONS.prix_in + CONTRADICTIONS.tokens_out_v2 * CONTRADICTIONS.prix_out) /
  1e6;

/* --------------------- scénarios de la source (section 8) ------------------ */
const SCENARIOS = [
  { id: "ess-normal", offre: "Essentiel", libelle: "Usage normal", detail: "1 nouveau dossier, ~30 questions", facture: 23, cout: [5.25, 6.45], dossiers: 1 },
  { id: "ess-max-ok", offre: "Essentiel", libelle: "Quota max, cache efficace", detail: "3 nouveaux dossiers, 100 questions", facture: 23, cout: 15.95, dossiers: 3 },
  { id: "ess-max-ko", offre: "Essentiel", libelle: "Quota max, cache peu efficace", detail: "3 nouveaux dossiers, 100 questions", facture: 23, cout: 19.95, dossiers: 3 },
  { id: "ana-normal", offre: "Analyste", libelle: "Usage normal", detail: "20 dossiers, 25 q/dossier, 1 comparaison", facture: 690, cout: 112, dossiers: 20 },
  { id: "ana-soutenu", offre: "Analyste", libelle: "Usage soutenu", detail: "40 dossiers, 60 q/dossier, 3 comparaisons", facture: 690, cout: 258, dossiers: 40 },
  { id: "ana-extreme", offre: "Analyste", libelle: "Usage extrême", detail: "60 dossiers, 100 q/dossier, 5 comparaisons", facture: 690, cout: 438, dossiers: 60 },
  { id: "fon-normal", offre: "Fonds (5 sièges)", libelle: "Usage normal", detail: "100 dossiers, 25 q/dossier, 5 comparaisons", facture: 2900, cout: 560, dossiers: 100 },
  { id: "fon-soutenu", offre: "Fonds (10 sièges)", libelle: "Usage soutenu", detail: "400 dossiers, 60 q/dossier, 30 comparaisons", facture: 5800, cout: 2580, dossiers: 400 },
  { id: "fon-extreme", offre: "Fonds (10 sièges)", libelle: "Usage extrême", detail: "600 dossiers, 100 q/dossier, 50 comparaisons", facture: 5800, cout: 4380, dossiers: 600 },
];

const mid = (c) => (Array.isArray(c) ? (c[0] + c[1]) / 2 : c);
const marge = (facture, cout) => (facture - cout) / facture;

const scenarios = SCENARIOS.map((s) => {
  const coutNominal = mid(s.cout);
  const coutActuel = coutNominal + s.dossiers * contradictionsActuel;
  const coutV2 = coutNominal + s.dossiers * contradictionsV2;
  return {
    ...s,
    coutNominal,
    margeNominale: marge(s.facture, coutNominal),
    coutActuel,
    margeActuelle: marge(s.facture, coutActuel),
    coutV2,
    margeV2: marge(s.facture, coutV2),
  };
});

/* ------------------------- Essentiel : effet de la TVA --------------------- */
const essentielHT = PRIX.essentiel / (1 + TVA);
const essentielTva = [
  { cas: "Usage normal", cout: mid([5.25, 6.45]) },
  { cas: "Quota max, cache efficace", cout: 15.95 },
  { cas: "Quota max, cache peu efficace", cout: 19.95 },
].map((c) => ({
  ...c,
  margeSiHT: marge(PRIX.essentiel, c.cout),
  margeSiTTC: marge(essentielHT, c.cout),
}));

/* ------------------------------ frais Stripe ------------------------------- */
const fraisStripe = (montant) => montant * STRIPE.pct + STRIPE.fixe;

/* --------------------------- coûts fixes de production --------------------- */
const FIXES_ACTUELS = [
  ["Hostinger KVM 2 (VPS, France)", 270 / 24, "270 € pour 2 ans, déjà payé — coût mensuel équivalent"],
  ["Nom de domaine", 12 / 12, "~12 €/an"],
  ["Claude Code (interne)", 20, "Abonnement Pro"],
];
const FIXES_PROD_A_VERIFIER = [
  ["Vercel Pro (1 siège)", 20, "Le plan Hobby est réservé à un usage non commercial — tarif public à confirmer"],
  ["Supabase Pro", 25, "Plan gratuit : pas de sauvegardes managées ni de SLA — tarif public à confirmer"],
];
const fixesActuels = FIXES_ACTUELS.reduce((a, r) => a + r[1], 0);
const fixesProd = fixesActuels + FIXES_PROD_A_VERIFIER.reduce((a, r) => a + r[1], 0);

/* --------------------------------- instantanés ----------------------------- */
const coutNormal = {
  essentiel: mid([5.25, 6.45]) + 1 * contradictionsV2,
  analyste: 112 + 20 * contradictionsV2,
  fonds5: 560 + 100 * contradictionsV2,
};

const INSTANTANES = [
  { nom: "Amorçage", ess: 20, ana: 2, fon: 0, structure: 300, note: "Phase MVP, bas de fourchette (300 €/mois)" },
  { nom: "Traction", ess: 60, ana: 8, fon: 1, structure: 800, note: "Phase MVP, haut de fourchette (800 €/mois)" },
  { nom: "Échelle", ess: 200, ana: 25, fon: 4, structure: 1500, note: "Phase SaaS B2B (1 500 €/mois et plus)" },
].map((s) => {
  const ca = s.ess * PRIX.essentiel + s.ana * PRIX.analyste + s.fon * PRIX.fonds_5_sieges;
  const variable = s.ess * coutNormal.essentiel + s.ana * coutNormal.analyste + s.fon * coutNormal.fonds5;
  const stripe = s.ess * fraisStripe(PRIX.essentiel) + s.ana * fraisStripe(PRIX.analyste) + s.fon * fraisStripe(PRIX.fonds_5_sieges);
  const avantStructure = ca - variable - stripe;
  const resultat = avantStructure - s.structure;
  return { ...s, ca, variable, stripe, avantStructure, resultat, reserve: Math.max(0, (ca - variable) * 0.125) };
});

/* --------------------------- seuils de rentabilité ------------------------- */
const margeUnitaire = {
  essentielHT: PRIX.essentiel - coutNormal.essentiel - fraisStripe(PRIX.essentiel),
  essentielTTC: essentielHT - coutNormal.essentiel - fraisStripe(PRIX.essentiel),
  analyste: PRIX.analyste - coutNormal.analyste - fraisStripe(PRIX.analyste),
};
const seuils = [150, 300, 800, 1500].map((b) => ({
  budget: b,
  analystes: Math.ceil(b / margeUnitaire.analyste),
  essentielHT: Math.ceil(b / margeUnitaire.essentielHT),
  essentielTTC: Math.ceil(b / margeUnitaire.essentielTTC),
}));

/* ------------------------------ calculateur ROI ---------------------------- */
const roi = (() => {
  const dossiers = 12;
  const heures = 14;
  const coutHoraire = 65;
  const part = 0.7;
  const eco = dossiers * heures * coutHoraire * part;
  const abo = PRIX.analyste * 12;
  return { dossiers, heures, coutHoraire, part, economieMensuelle: eco, economieAnnuelle: eco * 12, abonnementAnnuel: abo, net: eco * 12 - abo, multiple: (eco * 12) / abo };
})();

/* ------------------------- volumétrie base de données ---------------------- */
const volumetrie = (() => {
  const pages = 300;
  const chunksParPage = 1.25;
  const chunks = Math.round(pages * chunksParPage);
  const octetsVecteur = 1536 * 4;
  const octetsTexte = 2800;
  const octetsLigne = octetsVecteur + octetsTexte + 300;
  const donnees = (chunks * octetsLigne) / 1e6;
  const index = (chunks * octetsVecteur * 1.25) / 1e6;
  const totalMo = donnees + index;
  return { pages, chunks, octetsLigne, donneesMo: donnees, indexMo: index, totalMo, dossiersPour500Mo: Math.floor(500 / totalMo), dossiersPour8Go: Math.floor(8000 / totalMo) };
})();

module.exports = {
  PRIX, STRIPE, TVA, COUT, CONTRADICTIONS, contradictionsActuel, contradictionsV2,
  scenarios, essentielHT, essentielTva, fraisStripe, FIXES_ACTUELS, FIXES_PROD_A_VERIFIER,
  fixesActuels, fixesProd, coutNormal, INSTANTANES, instantanes: INSTANTANES, margeUnitaire, seuils, roi, volumetrie,
};

if (require.main === module) {
  const f = (n, d = 1) => n.toFixed(d);
  console.log("contradictions actuel/V2 ($):", f(contradictionsActuel, 2), f(contradictionsV2, 2));
  for (const s of scenarios) {
    console.log(
      `${s.offre.padEnd(18)} ${s.libelle.padEnd(30)} nominal ${f(s.margeNominale * 100)}%  actuel ${f(s.margeActuelle * 100)}%  v2 ${f(s.margeV2 * 100)}%`
    );
  }
  console.log("essentiel HT:", f(essentielHT, 2), essentielTva.map((e) => `${e.cas}: HT ${f(e.margeSiHT * 100)}% / TTC ${f(e.margeSiTTC * 100)}%`));
  console.log("fixes actuels/prod:", f(fixesActuels, 2), f(fixesProd, 2));
  console.log("instantanés:", INSTANTANES.map((i) => `${i.nom}: CA ${f(i.ca, 0)} var ${f(i.variable, 0)} stripe ${f(i.stripe, 0)} résultat ${f(i.resultat, 0)}`));
  console.log("marge unitaire:", margeUnitaire);
  console.log("seuils:", seuils);
  console.log("roi:", roi);
  console.log("volumétrie:", volumetrie);
}
