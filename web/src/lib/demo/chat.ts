/**
 * Échanges du Copilote pour la démonstration. Contrairement aux autres données
 * (extraites du prototype par script), ces réponses sont rédigées ici : le
 * prototype ne fournit de conversation préconstruite que pour la démo de la
 * page publique. Chaque réponse reprend strictement des faits déjà présents
 * dans les documents de démonstration, sources comprises.
 */
export type SourceChat = { document: string; page: number | null };
export type EchangeDemo = { question: string; reponse: string; sources: SourceChat[] };

export const CHAT_DEMO: Record<string, EchangeDemo[]> = {
  lvmh: [
    {
      question: "Évolution des marges opérationnelles sur 3 ans ?",
      reponse:
        "La marge opérationnelle recule de 26,6 % à 25,6 % entre 2022 et 2024. La direction l'attribue à l'accélération des investissements dans le réseau de distribution en propre et à un effet de change défavorable d'environ 40 points de base, tout en soulignant la résilience de la division Mode & Maroquinerie, dont la marge reste supérieure à celle du Groupe.",
      sources: [
        { document: "Compte de résultat consolidé", page: 148 },
        { document: "Commentaire de gestion", page: 151 },
        { document: "Revue des divisions", page: 62 },
      ],
    },
    {
      question: "Y a-t-il des covenants bancaires ?",
      reponse:
        "Aucun covenant financier dans les financements du Groupe : ni les emprunts obligataires, ni les 12,2 Md€ de lignes confirmées non tirées. Seules s'appliquent les clauses usuelles de pari passu et de negative pledge. La structure reste conservatrice à 0,9× EBITDA.",
      sources: [
        { document: "Note 18 — Emprunts et dettes financières", page: 171 },
        { document: "Structure de la dette", page: 153 },
      ],
    },
    {
      question: "Quels risques sont enterrés dans les annexes ?",
      reponse:
        "Deux éléments ne figurent que dans les notes annexes. D'abord une sensibilité accrue à la demande chinoise, susceptible d'affecter significativement les volumes de la division principale — non quantifiée dans le corps du rapport. Ensuite une progression des stocks (+11,3 %) supérieure à celle du chiffre d'affaires (+10,5 %), qui alourdit le besoin en fonds de roulement.",
      sources: [
        { document: "Note 34 — Facteurs de risque", page: 187 },
        { document: "Bilan — Actif circulant", page: 160 },
      ],
    },
    {
      question: "Quel est le niveau réel de génération de trésorerie ?",
      reponse:
        "Le free cash-flow atteint 10,5 Md€, en progression de 4,2 %, couvrant largement le service de la dette et le programme de distribution. Rapporté à une dette nette de 19,8 Md€, cela représente un ratio de couverture confortable, que le Groupe qualifie lui-même de conservateur.",
      sources: [
        { document: "Compte de résultat consolidé", page: 148 },
        { document: "Structure de la dette", page: 153 },
      ],
    },
  ],
  helios: [
    {
      question: "Pourquoi le chiffre d'affaires diffère-t-il entre les documents ?",
      reponse:
        "Le teaser investisseurs annonce 14,0 M€ quand l'annexe des états financiers retient 12,8 M€ net, un écart de 1,2 M€ (9,4 %). L'annexe précise que ce sont les refacturations de frais et le carnet de commandes signé non encore facturé qui expliquent la différence — la croissance de 38 % annoncée porte donc sur la base retraitée, pas sur le chiffre d'affaires net.",
      sources: [
        { document: "Teaser investisseurs", page: 12 },
        { document: "Annexe états financiers", page: 41 },
      ],
    },
    {
      question: "Y a-t-il une clause de liquidation préférentielle ?",
      reponse:
        "Oui, et elle n'apparaît dans aucun support de présentation : le pacte d'actionnaires prévoit une préférence de rang 1 non participante à 1,5× au profit des investisseurs du tour précédent. À une valorisation de sortie inférieure à environ 21 M€, les fondateurs et les nouveaux entrants ne percevraient rien.",
      sources: [{ document: "Pacte d'actionnaires", page: 8 }],
    },
    {
      question: "Quelle est la table de capitalisation ?",
      reponse:
        "La table de capitalisation entièrement diluée n'a pas été fournie — c'est un document manquant identifié dans la checklist de due diligence, nécessaire pour clôturer la revue juridique et modéliser le waterfall de sortie.",
      sources: [],
    },
    {
      question: "L'effectif annoncé est-il cohérent ?",
      reponse:
        "Non, il y a un écart de 6 ETP : la présentation management annonce 54 collaborateurs au 31 décembre 2024 quand l'annexe sociale retient un effectif moyen équivalent temps plein de 48. La différence tient probablement au décompte des prestataires indépendants et des alternants — sans incidence majeure sur la valorisation, mais elle affecte le calcul du chiffre d'affaires par tête souvent mis en avant.",
      sources: [
        { document: "Présentation management", page: 4 },
        { document: "Annexe sociale", page: 41 },
      ],
    },
  ],
};
