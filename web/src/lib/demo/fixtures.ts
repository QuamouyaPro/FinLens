import type { Enums } from "@/types/database";

type ProfilAnalyse = Enums<"profil_analyse">;
type TypeOperation = Enums<"type_operation">;

/**
 * Données du mode démo (Note de fonctionnement, section 1 et 8.4) : entièrement
 * fictives, codées en dur, aucun appel réseau. Reproduisent le jeu de données
 * du prototype cliquable (docs/finlens-plateforme-v1.html) pour que "Explorer
 * la plateforme" fonctionne sans compte ni clé API. Comme dans le prototype
 * original, seuls LVMH et Helios sont détaillés en profondeur (section 8.4) ;
 * les quatre autres dossiers ne servent qu'à peupler les listes et le tableau
 * de bord.
 */

export type DemoDossierMeta = {
  id: string;
  name: string;
  sector: string;
  type_operation: TypeOperation;
  risk_score: number | null;
  nb_documents: number;
  status: "actif";
  updated_at_label: string;
  approfondi: boolean;
};

export const DEMO_DOSSIERS: DemoDossierMeta[] = [
  { id: "lvmh", name: "LVMH — Rapport annuel 2024", sector: "Luxe", type_operation: "veille", risk_score: 24, nb_documents: 4, status: "actif", updated_at_label: "il y a 2 h", approfondi: true },
  { id: "helios", name: "Projet Helios — DD SaaS B2B", sector: "Tech / SaaS", type_operation: "due_diligence", risk_score: 61, nb_documents: 9, status: "actif", updated_at_label: "il y a 5 h", approfondi: true },
  { id: "aventis", name: "Aventis Biotech — Série B", sector: "Santé", type_operation: "serie_a_b", risk_score: 74, nb_documents: 6, status: "actif", updated_at_label: "hier", approfondi: false },
  { id: "meridian", name: "Groupe Meridian — LBO", sector: "Industrie", type_operation: "lbo", risk_score: 48, nb_documents: 12, status: "actif", updated_at_label: "il y a 3 j", approfondi: false },
  { id: "novagrid", name: "NovaGrid — Infra énergie", sector: "Énergie", type_operation: "screening", risk_score: 33, nb_documents: 3, status: "actif", updated_at_label: "il y a 4 j", approfondi: false },
  { id: "castellane", name: "Castellane & Fils — Transmission", sector: "Industrie", type_operation: "due_diligence", risk_score: 29, nb_documents: 7, status: "actif", updated_at_label: "la semaine dernière", approfondi: false },
];

export type DemoSource = { document: string; page: number | null };

export type DemoSignal = {
  id: string;
  dossierId: string;
  dossierName: string;
  gravite: "critique" | "a_verifier" | "info";
  titre: string;
  description: string;
  sources: DemoSource[];
  nonLu: boolean;
  quand: string;
};

export const DEMO_SIGNAUX: DemoSignal[] = [
  {
    id: "s1", dossierId: "helios", dossierName: "Projet Helios — DD SaaS B2B",
    gravite: "critique", titre: "Contradiction sur le chiffre d'affaires 2024",
    description: "Le teaser investisseurs annonce 14,0 M€ tandis que l'annexe des états financiers retient 12,8 M€ net. Écart de 1,2 M€ (9,4 %) non expliqué dans les supports commerciaux.",
    sources: [{ document: "Teaser investisseurs", page: 12 }, { document: "Annexe états financiers", page: 41 }],
    nonLu: true, quand: "il y a 2 h",
  },
  {
    id: "s2", dossierId: "helios", dossierName: "Projet Helios — DD SaaS B2B",
    gravite: "critique", titre: "Liquidation préférentielle 1,5× non divulguée",
    description: "Le pacte d'actionnaires prévoit une préférence de rang 1 non participante à 1,5× au profit des investisseurs du tour précédent. Cette clause n'apparaît dans aucun support de présentation.",
    sources: [{ document: "Pacte d'actionnaires", page: 8 }],
    nonLu: true, quand: "il y a 3 h",
  },
  {
    id: "s3", dossierId: "lvmh", dossierName: "LVMH — Rapport annuel 2024",
    gravite: "a_verifier", titre: "Exposition Chine citée uniquement en annexe",
    description: "Une sensibilité significative de la demande chinoise est mentionnée en note 34 mais n'est ni quantifiée ni reprise dans le corps du rapport de gestion.",
    sources: [{ document: "Note 34 — Facteurs de risque", page: 187 }],
    nonLu: true, quand: "il y a 6 h",
  },
  {
    id: "s4", dossierId: "lvmh", dossierName: "LVMH — Rapport annuel 2024",
    gravite: "a_verifier", titre: "Stocks en progression plus rapide que le CA",
    description: "Stocks +11,3 % contre +10,5 % pour le chiffre d'affaires, avec une rotation qui passe de 212 à 219 jours. Alourdissement du BFR à surveiller sur les prochains exercices.",
    sources: [{ document: "Bilan — Actif circulant", page: 160 }],
    nonLu: false, quand: "hier",
  },
  {
    id: "s5", dossierId: "meridian", dossierName: "Groupe Meridian — LBO",
    gravite: "a_verifier", titre: "Concentration client supérieure au seuil de vigilance",
    description: "Les trois premiers clients représentent 47 % du chiffre d'affaires. Le contrat du premier client arrive à échéance dans quatorze mois, sans clause de reconduction tacite.",
    sources: [{ document: "Structure de la dette", page: 153 }],
    nonLu: false, quand: "il y a 2 j",
  },
  {
    id: "s6", dossierId: "novagrid", dossierName: "NovaGrid — Infra énergie",
    gravite: "info", titre: "Documents manquants pour compléter l'analyse",
    description: "Le tableau de flux de trésorerie et les états financiers 2023 sont absents du dossier. Sans eux, l'analyse de la génération de cash reste partielle.",
    sources: [],
    nonLu: false, quand: "il y a 4 j",
  },
];

export type DemoContradiction = {
  id: string;
  gravite: "critique" | "a_verifier" | "mineur";
  titre: string;
  categorie: string;
  sourceA: { libelle: string; valeur: string; extrait: string };
  sourceB: { libelle: string; valeur: string; extrait: string };
  note: string;
};

export const DEMO_CONTRADICTIONS: Record<string, DemoContradiction[]> = {
  helios: [
    {
      id: "helios-1", gravite: "critique", titre: "Chiffre d'affaires 2024", categorie: "Écart de 1,2 M€ — 9,4 %",
      sourceA: { libelle: "Teaser investisseurs · p.12", valeur: "14,0 M€", extrait: "« Chiffre d'affaires 2024 : 14,0 M€, en croissance de 38 % »" },
      sourceB: { libelle: "Annexe états financiers · p.41", valeur: "12,8 M€", extrait: "« Chiffre d'affaires net 2024 : 12,8 M€ »" },
      note: "L'annexe précise que l'écart provient de l'inclusion, dans les supports commerciaux, des refacturations de frais et du carnet de commandes signé non encore facturé. À faire confirmer par le management : la croissance de 38 % annoncée porte sur la base retraitée, pas sur le CA net.",
    },
    {
      id: "helios-2", gravite: "critique", titre: "Liquidation préférentielle", categorie: "Clause absente des supports",
      sourceA: { libelle: "Pacte d'actionnaires · p.8", valeur: "1,5× rang 1", extrait: "« Liquidation préférentielle de rang 1, non participante, multiple 1,5× »" },
      sourceB: { libelle: "Supports de présentation", valeur: "Non mentionnée", extrait: "Aucune occurrence détectée dans les 4 documents de présentation indexés." },
      note: "Impact direct sur le waterfall de sortie : à une valorisation de sortie inférieure à environ 21 M€, les fondateurs et les nouveaux entrants ne perçoivent rien. À intégrer impérativement au modèle de retour.",
    },
    {
      id: "helios-3", gravite: "a_verifier", titre: "Effectif au 31/12", categorie: "Écart de 6 ETP",
      sourceA: { libelle: "Présentation management · p.4", valeur: "54 ETP", extrait: "« Une équipe de 54 collaborateurs au 31 décembre 2024 »" },
      sourceB: { libelle: "Annexe sociale · p.41", valeur: "48 ETP", extrait: "« Effectif moyen équivalent temps plein : 48 »" },
      note: "Différence probablement liée au décompte des prestataires indépendants et des alternants. Sans incidence majeure sur la valorisation, mais impacte le calcul du CA par tête souvent mis en avant.",
    },
  ],
  lvmh: [
    {
      id: "lvmh-1", gravite: "mineur", titre: "Périmètre de la marge commentée", categorie: "Base de calcul différente",
      sourceA: { libelle: "Commentaire de gestion · p.151", valeur: "25,6 %", extrait: "« Marge opérationnelle courante de 25,6 % »" },
      sourceB: { libelle: "Compte de résultat · p.148", valeur: "25,6 % / 26,4 %", extrait: "« 25,6 % contre 26,4 % en 2023 et 26,6 % en 2022 »" },
      note: "Les deux sources concordent sur 2024. Le commentaire de gestion ne rappelle toutefois pas la base 2022, ce qui minore optiquement l'érosion sur trois ans lorsqu'on ne lit que cette section.",
    },
  ],
};

export type DemoChecklistItem = { id: string; groupe: string; label: string; coche: boolean; manuel: boolean };

export const DEMO_CHECKLIST: Record<string, DemoChecklistItem[]> = {
  helios: [
    { id: "h1", groupe: "Financier", label: "Vérifier la réconciliation CA teaser / états financiers", coche: false, manuel: false },
    { id: "h2", groupe: "Financier", label: "Analyser la structure du revenu récurrent (ARR vs non récurrent)", coche: true, manuel: false },
    { id: "h3", groupe: "Financier", label: "Contrôler la trésorerie disponible et le runway", coche: true, manuel: false },
    { id: "h4", groupe: "Financier", label: "Obtenir le tableau de flux de trésorerie 2023-2024", coche: false, manuel: true },
    { id: "h5", groupe: "Financier", label: "Analyser le BFR et les délais de règlement clients", coche: false, manuel: false },
    { id: "h6", groupe: "Juridique & capital", label: "Lire le pacte d'actionnaires — clauses de liquidité", coche: true, manuel: false },
    { id: "h7", groupe: "Juridique & capital", label: "Cartographier la table de capitalisation entièrement diluée", coche: false, manuel: true },
    { id: "h8", groupe: "Juridique & capital", label: "Vérifier l'existence de litiges en cours", coche: true, manuel: false },
    { id: "h9", groupe: "Commercial & opérations", label: "Mesurer la concentration client (top 3 / top 10)", coche: true, manuel: false },
    { id: "h10", groupe: "Commercial & opérations", label: "Analyser le taux de rétention et le churn déclarés", coche: true, manuel: false },
  ],
  lvmh: [
    { id: "l1", groupe: "Financier", label: "Comparer la marge opérationnelle sur 3 exercices", coche: true, manuel: false },
    { id: "l2", groupe: "Financier", label: "Vérifier le ratio dette nette / EBITDA", coche: true, manuel: false },
    { id: "l3", groupe: "Risques", label: "Recouper les facteurs de risque avec le rapport de gestion", coche: false, manuel: true },
  ],
};

export type DemoIndicateur = { libelle: string; valeur: string; source: DemoSource | null };

export type DemoProfilNote = {
  resume: string;
  score: number;
  axes: { axe: string; poids: number }[];
  indicateurs: DemoIndicateur[];
  sections: { titre: string; contenu: string[] }[];
};

const SOURCE_P148: DemoSource = { document: "Compte de résultat", page: 148 };
const SOURCE_P151: DemoSource = { document: "Commentaire de gestion", page: 151 };
const SOURCE_P153: DemoSource = { document: "Structure de la dette", page: 153 };
const SOURCE_P62: DemoSource = { document: "Revue des divisions", page: 62 };
const SOURCE_P171: DemoSource = { document: "Note 18 — Emprunts", page: 171 };
const SOURCE_P187: DemoSource = { document: "Note 34 — Facteurs de risque", page: 187 };

export const DEMO_PROFILS: Record<string, Partial<Record<ProfilAnalyse, DemoProfilNote>>> = {
  lvmh: {
    pe_vc: {
      resume: "Actif mature à forte génération de trésorerie : la structure de bilan soutient à la fois une thèse de rendement (levier quasi nul) et une thèse de croissance (relais géographiques). Le point d'arbitrage central reste l'érosion de la marge sur trois ans, qui pèse sur tout multiple assis sur l'EBITDA courant.",
      score: 37,
      axes: [
        { axe: "Solidité de la thèse d'investissement", poids: 28 },
        { axe: "Effet de levier soutenable", poids: 22 },
        { axe: "Trajectoire de croissance", poids: 34 },
        { axe: "Cohérence des multiples de valorisation", poids: 46 },
        { axe: "Qualité de l'information", poids: 55 },
      ],
      indicateurs: [
        { libelle: "Free cash-flow", valeur: "10,5 Md€", source: SOURCE_P148 },
        { libelle: "Dette nette / EBITDA", valeur: "0,9×", source: SOURCE_P153 },
        { libelle: "Marge opérationnelle", valeur: "25,6 %", source: SOURCE_P148 },
        { libelle: "Croissance division principale", valeur: "+10 %", source: SOURCE_P62 },
      ],
      sections: [
        { titre: "Points d'appui de la thèse", contenu: [
          "Free cash-flow de 10,5 Md€, en progression de 4,2 %, couvrant largement le service de la dette et le programme de distribution.",
          "Dette nette sur EBITDA à 0,9×, qualifiée de conservatrice par la direction — capacité d'endettement additionnelle significative.",
          "Croissance organique de 10 % portée par la division principale, dont la marge reste supérieure à la moyenne du groupe.",
        ]},
        { titre: "Zones de vigilance pour la thèse", contenu: [
          "Érosion de la marge opérationnelle de 26,6 % à 25,6 % sur trois exercices, qui pèse mécaniquement sur tout multiple assis sur l'EBITDA courant.",
          "Effet de change défavorable estimé à 40 points de base : une composante non structurelle de l'érosion, à isoler dans le modèle.",
          "Absence de tout covenant financier : latitude de structuration inhabituelle, mais aussi absence de garde-fou contractuel visible.",
        ]},
      ],
    },
    ma: {
      resume: "Structure sans covenant financier, ce qui simplifie la structuration d'une opération mais retire un point de repère habituel sur la tolérance au levier du prêteur historique. Les synergies potentielles se concentrent sur la distribution et les achats.",
      score: 44,
      axes: [
        { axe: "Complexité de structuration", poids: 30 },
        { axe: "Risques juridiques identifiés", poids: 25 },
        { axe: "Potentiel de synergies", poids: 40 },
        { axe: "Qualité de la documentation", poids: 50 },
      ],
      indicateurs: [
        { libelle: "Covenants bancaires", valeur: "Aucun", source: SOURCE_P171 },
        { libelle: "Lignes non tirées", valeur: "12,2 Md€", source: SOURCE_P171 },
        { libelle: "Dette nette", valeur: "19,8 Md€", source: SOURCE_P153 },
      ],
      sections: [
        { titre: "Structuration de la transaction", contenu: [
          "Aucun covenant financier dans les financements existants : ni les emprunts obligataires, ni les 12,2 Md€ de lignes confirmées non tirées.",
          "Seules s'appliquent les clauses usuelles de pari passu et de negative pledge — peu contraignantes pour un schéma de rapprochement.",
        ]},
        { titre: "Synergies et risques juridiques", contenu: [
          "Synergies potentielles concentrées sur la distribution en propre et les achats de matières premières.",
          "Aucun litige matériel identifié dans les documents indexés à ce stade de l'analyse.",
        ]},
      ],
    },
    family_office: {
      resume: "Position patrimoniale saine pour une allocation long terme : génération de cash récurrente, levier faible, diversification géographique déjà engagée. Le principal risque à surveiller est la concentration sectorielle sur le luxe, sensible aux cycles de consommation discrétionnaire.",
      score: 24,
      axes: [
        { axe: "Préservation du capital", poids: 20 },
        { axe: "Diversification géographique", poids: 18 },
        { axe: "Régularité des flux de trésorerie", poids: 15 },
        { axe: "Sensibilité au cycle économique", poids: 42 },
      ],
      indicateurs: [
        { libelle: "Capitaux propres", valeur: "56,8 Md€", source: null },
        { libelle: "Free cash-flow", valeur: "10,5 Md€", source: SOURCE_P148 },
        { libelle: "Dette nette / EBITDA", valeur: "0,9×", source: SOURCE_P153 },
      ],
      sections: [
        { titre: "Poids dans un portefeuille diversifié", contenu: [
          "Actif à faible endettement relatif, adapté à une logique de préservation du capital sur longue période.",
          "Exposition au cycle du luxe : les revenus discrétionnaires sont plus sensibles à un ralentissement macroéconomique que la consommation courante.",
          "Relais de croissance en Asie hors Chine à surveiller comme facteur de diversification géographique additionnelle.",
        ]},
      ],
    },
    cfo: {
      resume: "Positionnement de marge encore supérieur à la moyenne sectorielle malgré l'érosion récente. Utile comme référence de benchmark pour une direction financière évaluant sa propre trajectoire face à un leader du secteur.",
      score: 33,
      axes: [
        { axe: "Écart de marge vs pairs", poids: 25 },
        { axe: "Discipline de structure de coûts", poids: 30 },
        { axe: "Visibilité du pilotage", poids: 35 },
      ],
      indicateurs: [
        { libelle: "Marge opérationnelle", valeur: "25,6 %", source: SOURCE_P148 },
        { libelle: "Évolution sur 3 ans", valeur: "−1,0 pt", source: SOURCE_P148 },
        { libelle: "Rotation des stocks", valeur: "219 jours", source: null },
      ],
      sections: [
        { titre: "Benchmark et positionnement", contenu: [
          "Marge opérationnelle en repli de 26,6 % à 25,6 % sur trois exercices, mais qui reste structurellement supérieure à la moyenne du secteur du luxe.",
          "La rotation des stocks se dégrade (212 à 219 jours), signal à intégrer dans un exercice de benchmark sur le pilotage du BFR.",
        ]},
      ],
    },
    audit_conseil: {
      resume: "Aucune anomalie comptable structurante détectée. Deux points méritent une note au dossier : la formulation du commentaire de gestion sur la marge (base de comparaison partielle) et l'absence de quantification du risque Chine dans le corps du rapport.",
      score: 32,
      axes: [
        { axe: "Cohérence inter-documents", poids: 20 },
        { axe: "Qualité des provisions", poids: 15 },
        { axe: "Exhaustivité des annexes", poids: 38 },
      ],
      indicateurs: [
        { libelle: "Contradictions détectées", valeur: "1 (mineure)", source: null },
        { libelle: "Données estimées", valeur: "2 lignes", source: null },
      ],
      sections: [
        { titre: "Points de vigilance pour la mission", contenu: [
          "Le commentaire de gestion cite la marge 2024 sans rappeler la base 2022, minorant optiquement l'érosion sur trois ans pour un lecteur pressé.",
          "La sensibilité à la demande chinoise n'est quantifiée qu'en note annexe (note 34), absente du corps du rapport de gestion.",
        ]},
      ],
    },
    generaliste: {
      resume: "En langage simple : l'entreprise gagne beaucoup plus d'argent qu'elle n'en dépense (elle a peu de dettes), mais elle garde un peu moins d'argent sur chaque produit vendu qu'il y a trois ans. Rien d'alarmant, mais une tendance à surveiller.",
      score: 30,
      axes: [
        { axe: "Solidité financière", poids: 15 },
        { axe: "Rentabilité", poids: 30 },
        { axe: "Risques identifiés", poids: 35 },
      ],
      indicateurs: [
        { libelle: "Ce qu'il reste sur 100 € vendus", valeur: "25,60 €", source: SOURCE_P148 },
        { libelle: "Dettes par rapport aux bénéfices", valeur: "0,9 fois (faible)", source: SOURCE_P153 },
      ],
      sections: [
        { titre: "En résumé", contenu: [
          "Sur 100 € de vente, l'entreprise garde 25,60 € de bénéfice d'exploitation — un peu moins qu'il y a trois ans (26,60 €), mais toujours un très bon niveau pour ce secteur.",
          "L'entreprise a très peu de dettes par rapport à ce qu'elle gagne chaque année : elle pourrait rembourser toutes ses dettes en moins d'un an de bénéfices.",
          "Un risque est mentionné en petit caractère : une baisse de la demande en Chine pourrait peser sur les ventes futures, sans que l'ampleur soit précisée.",
        ]},
      ],
    },
  },
  helios: {
    pe_vc: {
      resume: "Croissance élevée mais sur une base de chiffre d'affaires contestée : l'écart de 1,2 M€ entre le teaser et l'annexe change matériellement le multiple de revenu affiché. La clause de liquidation préférentielle non divulguée modifie en profondeur le waterfall de sortie.",
      score: 68,
      axes: [
        { axe: "Fiabilité du chiffre d'affaires annoncé", poids: 72 },
        { axe: "Structure du capital et préférences", poids: 78 },
        { axe: "Qualité du revenu récurrent", poids: 35 },
        { axe: "Dépendance aux personnes clés", poids: 55 },
      ],
      indicateurs: [
        { libelle: "CA annoncé (teaser)", valeur: "14,0 M€", source: { document: "Teaser investisseurs", page: 12 } },
        { libelle: "CA net (annexe)", valeur: "12,8 M€", source: { document: "Annexe états financiers", page: 41 } },
        { libelle: "Liquidation préférentielle", valeur: "1,5× rang 1", source: { document: "Pacte d'actionnaires", page: 8 } },
      ],
      sections: [
        { titre: "Ce qui change la thèse", contenu: [
          "Le multiple de revenu affiché doit être recalculé sur la base nette de 12,8 M€, pas sur les 14,0 M€ du teaser — soit environ 9,4 % de valorisation implicite en moins à multiple constant.",
          "La préférence de liquidation 1,5× non divulguée modifie le waterfall : en dessous d'environ 21 M€ de valorisation de sortie, les nouveaux entrants et les fondateurs ne perçoivent rien.",
          "Le revenu récurrent doit être isolé des refacturations et du carnet signé non facturé pour juger de la vraie trajectoire ARR.",
        ]},
      ],
    },
    ma: {
      resume: "Due diligence à mener avec vigilance sur la structure capitalistique : la clause de préférence non divulguée constitue un point de négociation majeur, potentiellement disqualifiant si elle n'est pas renégociée avant closing.",
      score: 61,
      axes: [
        { axe: "Risques juridiques", poids: 75 },
        { axe: "Cohérence des supports commerciaux", poids: 70 },
        { axe: "Synergies potentielles", poids: 30 },
      ],
      indicateurs: [
        { libelle: "Écart CA teaser / net", valeur: "1,2 M€ (9,4 %)", source: { document: "Annexe états financiers", page: 41 } },
        { libelle: "Clause de préférence", valeur: "Non divulguée initialement", source: { document: "Pacte d'actionnaires", page: 8 } },
      ],
      sections: [
        { titre: "Points de négociation", contenu: [
          "La non-divulgation initiale de la préférence de liquidation constitue un point de vigilance sur la qualité de la représentation du vendeur — à documenter dans les garanties d'actif-passif.",
          "L'écart de CA doit être clarifié par écrit avant la poursuite du processus : il conditionne la valorisation de base de la négociation.",
        ]},
      ],
    },
    family_office: {
      resume: "Profil de risque élevé, cohérent avec un stade de développement précoce : dépendant de la clarification des deux contradictions majeures avant tout engagement de capital patrimonial.",
      score: 66,
      axes: [
        { axe: "Préservation du capital investi", poids: 70 },
        { axe: "Visibilité sur la structure de sortie", poids: 74 },
        { axe: "Diversification déjà engagée", poids: 20 },
      ],
      indicateurs: [
        { libelle: "Stade", valeur: "Série B", source: null },
        { libelle: "Contradictions ouvertes", valeur: "2 critiques", source: null },
      ],
      sections: [
        { titre: "Lecture patrimoniale", contenu: [
          "À ce stade de maturité et avec deux contradictions non résolues, ce dossier relève d'une logique de capital-risque diversifié, pas d'une allocation de préservation de capital.",
          "La clause de préférence de liquidation doit être pleinement comprise avant tout engagement : elle détermine ce qui revient réellement à un nouvel investisseur en cas de sortie sous-optimale.",
        ]},
      ],
    },
    cfo: {
      resume: "Repère utile pour une direction financière évaluant un partenaire ou un fournisseur stratégique : la structure de coûts et la rétention client sont solides, mais la fiabilité du reporting commercial est à challenger.",
      score: 55,
      axes: [
        { axe: "Fiabilité du reporting", poids: 68 },
        { axe: "Rétention et churn", poids: 25 },
        { axe: "Dépendance client", poids: 40 },
      ],
      indicateurs: [
        { libelle: "Effectif déclaré (présentation)", valeur: "54 ETP", source: { document: "Présentation management", page: 4 } },
        { libelle: "Effectif réel (annexe sociale)", valeur: "48 ETP", source: { document: "Annexe sociale", page: 41 } },
      ],
      sections: [
        { titre: "Fiabilité des chiffres communiqués", contenu: [
          "Écart de 6 ETP entre la présentation commerciale et l'annexe sociale — probablement lié au décompte des prestataires, mais révélateur d'un manque de rigueur dans les supports externes.",
          "Le taux de rétention et le churn déclarés sont cohérents avec les standards du secteur SaaS B2B, sans anomalie détectée.",
        ]},
      ],
    },
    audit_conseil: {
      resume: "Dossier nécessitant une revue approfondie avant toute conclusion : deux contradictions critiques et une divergence mineure sur l'effectif constituent des zones de risque à documenter explicitement dans la note de synthèse.",
      score: 70,
      axes: [
        { axe: "Cohérence inter-documents", poids: 78 },
        { axe: "Exhaustivité des annexes", poids: 55 },
        { axe: "Traçabilité des clauses juridiques", poids: 72 },
      ],
      indicateurs: [
        { libelle: "Contradictions critiques", valeur: "2", source: null },
        { libelle: "Contradictions mineures", valeur: "1", source: null },
        { libelle: "Documents manquants", valeur: "Table de capitalisation diluée", source: null },
      ],
      sections: [
        { titre: "Zones de risque à documenter", contenu: [
          "Contradiction de CA (14,0 M€ vs 12,8 M€) : à faire trancher par écrit avec le management avant toute conclusion sur la valorisation.",
          "Clause de liquidation préférentielle absente des supports de présentation : anomalie de communication à signaler formellement.",
          "Table de capitalisation entièrement diluée non obtenue à ce stade — document nécessaire pour clôturer la revue juridique.",
        ]},
      ],
    },
    generaliste: {
      resume: "En clair : l'entreprise dit avoir vendu pour 14 millions d'euros, mais ses propres comptes n'en montrent que 12,8. Et un document caché dit qu'en cas de revente, certains investisseurs seraient payés avant les autres. Deux points à éclaircir avant d'aller plus loin.",
      score: 61,
      axes: [
        { axe: "Cohérence des chiffres", poids: 70 },
        { axe: "Transparence des documents", poids: 75 },
        { axe: "Risques identifiés", poids: 60 },
      ],
      indicateurs: [
        { libelle: "Chiffre annoncé vs chiffre réel", valeur: "14,0 M€ vs 12,8 M€", source: { document: "Annexe états financiers", page: 41 } },
      ],
      sections: [
        { titre: "En résumé", contenu: [
          "L'entreprise communique un chiffre de vente supérieur de 9 % à ce que montrent ses propres comptes — ce n'est pas forcément grave, mais ça doit être expliqué.",
          "Un document juridique donne un avantage à certains investisseurs en cas de revente, sans que ce soit mentionné dans les présentations — à faire confirmer avant d'investir.",
        ]},
      ],
    },
  },
};

export type DemoQuestion = { question: string; reponse: string; sources: DemoSource[] };

export const DEMO_CHAT: Record<string, DemoQuestion[]> = {
  lvmh: [
    {
      question: "Évolution des marges opérationnelles sur 3 ans ?",
      reponse: "La marge opérationnelle recule de 26,6 % à 25,6 % entre 2022 et 2024. La direction l'attribue à l'accélération des investissements retail et à un effet de change défavorable d'environ 40 points de base, tout en soulignant la résilience de la division Mode & Maroquinerie, dont la marge reste supérieure à celle du Groupe.",
      sources: [SOURCE_P148, SOURCE_P151, SOURCE_P62],
    },
    {
      question: "Y a-t-il des covenants bancaires ?",
      reponse: "Aucun covenant financier dans les financements du Groupe : ni les emprunts obligataires, ni les 12,2 Md€ de lignes confirmées non tirées. Seules s'appliquent les clauses usuelles de pari passu et de negative pledge. La structure reste conservatrice à 0,9× EBITDA.",
      sources: [SOURCE_P171, SOURCE_P153],
    },
    {
      question: "Quels risques sont enterrés dans les annexes ?",
      reponse: "Deux éléments ne figurent que dans les notes annexes. D'abord une sensibilité accrue à la demande chinoise, susceptible d'affecter significativement les volumes de la division principale — non quantifiée dans le corps du rapport. Ensuite une progression des stocks (+11,3 %) supérieure à celle du chiffre d'affaires (+10,5 %), qui alourdit le besoin en fonds de roulement.",
      sources: [SOURCE_P187, { document: "Bilan — Actif circulant", page: 160 }],
    },
    {
      question: "Quel est le niveau réel de génération de trésorerie ?",
      reponse: "Le free cash-flow atteint 10,5 Md€, en progression de 4,2 %, couvrant largement le service de la dette et le programme de distribution. Rapporté à une dette nette de 19,8 Md€, cela représente un ratio de couverture confortable, que le Groupe qualifie lui-même de conservateur.",
      sources: [SOURCE_P148, SOURCE_P153],
    },
  ],
  helios: [
    {
      question: "Pourquoi le chiffre d'affaires diffère-t-il entre les documents ?",
      reponse: "Le teaser investisseurs annonce 14,0 M€ quand l'annexe des états financiers retient 12,8 M€ net, un écart de 1,2 M€ (9,4 %). L'annexe précise que ce sont les refacturations de frais et le carnet de commandes signé non encore facturé qui expliquent la différence — la croissance de 38 % annoncée porte donc sur la base retraitée, pas sur le CA net.",
      sources: [{ document: "Teaser investisseurs", page: 12 }, { document: "Annexe états financiers", page: 41 }],
    },
    {
      question: "Y a-t-il une clause de liquidation préférentielle ?",
      reponse: "Oui, et elle n'apparaît dans aucun support de présentation : le pacte d'actionnaires prévoit une préférence de rang 1 non participante à 1,5× au profit des investisseurs du tour précédent. À une valorisation de sortie inférieure à environ 21 M€, les fondateurs et les nouveaux entrants ne percevraient rien.",
      sources: [{ document: "Pacte d'actionnaires", page: 8 }],
    },
    {
      question: "Quelle est la table de capitalisation ?",
      reponse: "La table de capitalisation entièrement diluée n'a pas encore été obtenue — c'est un document manquant identifié dans la checklist de due diligence, nécessaire avant de conclure la revue juridique.",
      sources: [],
    },
  ],
};

export function trouverDossier(id: string) {
  return DEMO_DOSSIERS.find((d) => d.id === id) ?? null;
}
