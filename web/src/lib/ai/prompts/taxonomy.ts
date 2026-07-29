/**
 * Taxonomie des 6 catégories d'indicateurs couvertes par l'extraction exhaustive
 * (Note d'Architecture, section 4.I.1). Chaque donnée doit être sourcée (page/
 * paragraphe exact) ; une donnée absente est marquée comme telle plutôt que
 * comblée par une estimation -- cohérent avec le pilier "zéro hallucination".
 */
export const CATEGORIES_EXTRACTION = [
  "financier",
  "juridique",
  "concurrentiel",
  "esg",
  "gouvernance",
  "risques",
] as const;

export type CategorieExtraction = (typeof CATEGORIES_EXTRACTION)[number];

export const TAXONOMIE_DETAIL: Record<CategorieExtraction, string> = {
  financier:
    "Rentabilité (marge brute, marge EBITDA, marge nette, ROE, ROCE), structure & solvabilité " +
    "(autonomie financière, gearing, levier dette nette/EBITDA, capacité de remboursement), " +
    "liquidité (liquidité générale, liquidité réduite, couverture des frais financiers), " +
    "BFR & cycle d'exploitation (BFR en jours de CA, DSO, DPO, rotation des stocks), " +
    "flux & trésorerie (CAF, Free Cash Flow, FRR, trésorerie nette), " +
    "croissance & valorisation (TCAM CA/EBITDA, multiples EV/EBITDA, EV/CA, part du CA récurrent).",
  juridique:
    "Structure capitalistique, pactes d'actionnaires, clauses d'earn-out, crédit-vendeur, " +
    "garanties d'actif-passif, covenants bancaires et marge par rapport aux seuils, litiges en " +
    "cours (montant, provisionné ou non), propriété intellectuelle, clauses de changement de " +
    "contrôle, conformité réglementaire sectorielle.",
  concurrentiel:
    "Position et part de marché estimée, concentration clients et fournisseurs, pricing power, " +
    "barrières à l'entrée, avantage concurrentiel déclaré, pipeline commercial, taux de " +
    "conversion, comparaison sectorielle (marge, croissance vs pairs).",
  esg:
    "Émissions carbone (scope 1/2/3 si disponibles), politique RSE et engagements déclarés, " +
    "diversité (gouvernance, effectifs), controverses environnementales/sociales, notation ESG " +
    "externe si mentionnée, alignement taxonomie verte le cas échéant.",
  gouvernance:
    "Composition et indépendance du board/comité de direction, historique et ancienneté des " +
    "dirigeants clés, dépendance au dirigeant, rémunération dirigeante, turnover des cadres clés.",
  risques:
    "Capitaux propres < 50% du capital social (alerte légale), CAF négative ou en dégradation " +
    "continue, marge EBITDA en érosion sur 3 ans, DSO en dégradation, BFR croissant plus vite " +
    "que le CA, incohérences entre documents du même dossier, informations significatives isolées " +
    "en note de bas de page.",
};

export const REGLE_ZERO_HALLUCINATION =
  "Règle absolue : ne réponds qu'à partir du texte fourni. Chaque donnée chiffrée ou affirmation " +
  "doit citer sa source exacte (nom du document, page, paragraphe). Si une information n'est pas " +
  "présente dans les documents fournis, marque-la explicitement comme [DONNÉE MANQUANTE] plutôt " +
  "que de l'estimer ou de l'inventer.";
