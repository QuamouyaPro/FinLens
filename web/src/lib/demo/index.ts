import dossiersJson from "./data/dossiers.json";
import signalsJson from "./data/signals.json";
import contraJson from "./data/contra.json";
import checklistJson from "./data/checklist.json";
import statementsJson from "./data/statements.json";
import qpacksJson from "./data/qpacks.json";
import gapsJson from "./data/gaps.json";
import kpiLibJson from "./data/kpiLib.json";
import profilesJson from "./data/profiles.json";
import globalResultsJson from "./data/globalResults.json";
import stagesJson from "./data/stages.json";
import type {
  CleProfilPrototype,
  Contradiction,
  DossierPrototype,
  Etats,
  GroupeChecklist,
  Kpi,
  Profil,
  ResultatGlobal,
  Signal,
} from "./types";

/**
 * Point d'accès unique aux données de démonstration, extraites du prototype
 * (docs/finlens-plateforme-v1.html) par script — voir types.ts. Aucune de ces
 * valeurs n'est saisie à la main : pour corriger un contenu, on modifie le
 * prototype puis on relance l'extraction.
 */
export const DOSSIERS = dossiersJson as DossierPrototype[];
export const SIGNAUX = signalsJson as Signal[];
export const CONTRADICTIONS = contraJson as Record<string, Contradiction[]>;
export const CHECKLISTS = checklistJson as Record<string, GroupeChecklist[]>;
export const ETATS_FINANCIERS = statementsJson as unknown as Record<string, Etats>;
export const QPACKS = qpacksJson as Record<string, string[]>;
export const DOCUMENTS_MANQUANTS = gapsJson as unknown as Record<string, [string, string][]>;
export const KPI_LIB = kpiLibJson as unknown as Record<string, Kpi>;
export const PROFILS = profilesJson as unknown as Record<CleProfilPrototype, Profil>;
export const RESULTATS_GLOBAUX = globalResultsJson as ResultatGlobal[];
export const ETAPES = stagesJson as [string, string, string][];

/** Les dossiers visibles dans la démonstration (le prototype en archive deux). */
export const DOSSIERS_ACTIFS = DOSSIERS.filter((d) => d.state === "active");

export function trouverDossier(id: string): DossierPrototype | undefined {
  return DOSSIERS.find((d) => d.id === id);
}

export function signauxNonLus(): number {
  return SIGNAUX.filter((s) => s.unread).length;
}

/** Les dossiers détaillés en profondeur dans le prototype (section 8.4). */
export const DOSSIERS_DETAILLES = ["lvmh", "helios"];

export function estDetaille(id: string): boolean {
  return DOSSIERS_DETAILLES.includes(id);
}

export function kpisDuProfil(cle: CleProfilPrototype): Kpi[] {
  const profil = PROFILS[cle];
  if (!profil) return [];
  return profil.kpiOrder.map((k) => KPI_LIB[k]).filter(Boolean);
}
