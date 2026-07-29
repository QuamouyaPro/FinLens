import type { Enums } from "@/types/database";

type TypeOperation = Enums<"type_operation">;

/**
 * Checklist de due diligence pré-chargée selon le type d'opération déclaré
 * (Note explicative, section 6.1 / 10.2). Cochée automatiquement ensuite à
 * mesure que le moteur trouve la réponse dans l'extraction (voir analyser/route.ts).
 */
export const CHECKLIST_TEMPLATES: Record<TypeOperation, string[]> = {
  due_diligence: [
    "Covenants bancaires et seuils associés",
    "Litiges en cours et provisions",
    "Structure capitalistique et pactes d'actionnaires",
    "Clauses de changement de contrôle",
    "Concentration clients et fournisseurs",
    "Conformité réglementaire sectorielle",
  ],
  lbo: [
    "Covenants bancaires et marge par rapport aux seuils",
    "Dette financière nette et levier (dette nette / EBITDA)",
    "Capacité de remboursement / CAF",
    "Clauses d'earn-out et crédit-vendeur",
    "Garanties d'actif-passif",
  ],
  serie_a_b: [
    "Table de capitalisation",
    "Clause de liquidation préférentielle",
    "Pacte d'actionnaires et droits de véto",
    "Runway et consommation de trésorerie",
    "Propriété intellectuelle",
  ],
  screening: [
    "Position et part de marché estimée",
    "Structure capitalistique",
    "Indicateurs de rentabilité principaux",
    "Signaux de risque (section 6 taxonomie)",
  ],
  veille: [
    "Benchmark sectoriel",
    "Comparaison de marge et de croissance vs pairs",
    "Notation ESG externe si mentionnée",
  ],
};
