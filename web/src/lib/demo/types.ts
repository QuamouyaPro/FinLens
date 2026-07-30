import type { Enums } from "@/types/database";

/**
 * Types des données extraites du prototype (src/lib/demo/data/*.json).
 * Les JSON sont générés depuis docs/finlens-plateforme-v1.html, ils ne sont pas
 * saisis à la main : toute correction se fait dans le prototype puis par
 * ré-extraction.
 */

export type CleProfilPrototype = "pevc" | "ma" | "family" | "cfo" | "audit" | "general" | "custom";

/** Le prototype et la base de données ne nomment pas les profils pareil. */
export const PROFIL_VERS_BDD: Record<CleProfilPrototype, Enums<"profil_analyse">> = {
  pevc: "pe_vc",
  ma: "ma",
  family: "family_office",
  cfo: "cfo",
  audit: "audit_conseil",
  general: "generaliste",
  custom: "personnalise",
};

export const ORDRE_PROFILS: CleProfilPrototype[] = [
  "pevc", "ma", "family", "cfo", "audit", "general", "custom",
];

export type DossierPrototype = {
  id: string;
  name: string;
  sector: string;
  type: string;
  docs: number;
  status: "ready" | "progress" | "new";
  state: "active" | "archived" | "trash";
  stage: string;
  risk: number;
  when: string;
  compl: number;
};

export type Kpi = {
  l: string;
  v: string;
  d: string | null;
  c: "up" | "down" | "warn" | "flat" | null;
  src: string | null;
  spark: number[] | null;
  est?: boolean;
};

/** Bloc de résumé : [couleur, icône, titre, [[texte, estAlerte], ...]] */
export type SectionResume = [string, string, string, [string, number][]];

/** Blocs de la note complète — le premier élément donne le type. */
export type BlocNote =
  | ["p", string]
  | ["h3", string]
  | ["ul" | "ulw" | "ulc", string[]]
  | ["call" | "callw" | "callc", string, string]
  | ["tbl", string[], string[][]];

export type SectionNote = {
  n: string;
  t: string;
  lead: string;
  b: BlocNote[];
};

export type Profil = {
  label: string;
  short: string;
  ic: string;
  tier?: string;
  tag: string;
  lens?: string;
  score: number;
  axes: [string, number][];
  sections: SectionResume[];
  note: SectionNote[];
  kpiOrder: string[];
};

export type LigneEtat = {
  l: string;
  v: string[];
  d: string | null;
  c: "up" | "down" | "flat" | null;
  src: string | null;
  est: boolean;
  bold: boolean;
  indent: boolean;
};

export type Etats = {
  unit: string;
  years: string[];
  docSet: string;
  simple: LigneEtat[];
  compteResultat: LigneEtat[];
  bilanActif: LigneEtat[];
  bilanPassif: LigneEtat[];
  fluxTresorerie: LigneEtat[];
  evolutions: { t: string; b: string }[];
};

export type Signal = {
  id: string;
  lvl: "crit" | "warn" | "info";
  dossier: string;
  dn: string;
  title: string;
  desc: string;
  src: [string, string, string][];
  unread: boolean;
  when: string;
};

export type Contradiction = {
  lvl: "high" | "med" | "low";
  title: string;
  cat: string;
  a: { lbl: string; v: string; q: string; k: string };
  b: { lbl: string; v: string; q: string; k: string };
  note: string;
};

export type GroupeChecklist = {
  g: string;
  items: { t: string; done: boolean; auto: boolean; flag?: string }[];
};

export type ResultatGlobal = {
  d: string;
  id: string;
  doc: string;
  pg: string;
  k: string;
  q?: string;
  ex?: string;
};
