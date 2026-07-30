import type { IconName } from "@/components/ui/icon";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  /** Clé du compteur affiché à droite du libellé. */
  compteur?: "dossiers" | "signaux";
  /** Réservé aux offres Analyste et Fonds. */
  offresPro?: boolean;
  /** Réservé à l'offre Fonds (multi-sièges). */
  offreFonds?: boolean;
};

export const NAV_PRINCIPALE: NavItem[] = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: "grid" },
  { href: "/dossiers", label: "Dossiers", icon: "folder", compteur: "dossiers" },
  { href: "/signaux", label: "Signaux", icon: "alert", compteur: "signaux" },
  { href: "/recherche", label: "Recherche globale", icon: "srch" },
  { href: "/comparateur", label: "Comparateur", icon: "split", offresPro: true },
  { href: "/exports", label: "Exports", icon: "dl" },
];

export const NAV_COMPTE: NavItem[] = [
  { href: "/facturation", label: "Facturation", icon: "card" },
  { href: "/equipe", label: "Équipe", icon: "users", offreFonds: true },
  { href: "/reglages", label: "Réglages", icon: "sliders" },
];
