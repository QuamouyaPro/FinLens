"use client";

import { useState } from "react";
import { Icon } from "./icon";

const STORAGE_KEY = "finlens-theme";

/** Lit le thème réellement appliqué par le script inline du layout racine. */
function themeCourant(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * Bascule sombre/clair (Note de fonctionnement, 17.1). Le thème sombre est le
 * défaut ; les panneaux « ink » restent sombres dans les deux thèmes, c'est la
 * signature de marque. Le choix est mémorisé et appliqué avant le premier paint
 * par le script inline du layout racine.
 */
export function ThemeToggle({ variant = "light" }: { variant?: "light" | "ink" }) {
  // Initialisé paresseusement depuis le DOM : l'icône affichée correspond au
  // thème déjà appliqué, sans passer par un effet ni provoquer un second rendu.
  const [theme, setTheme] = useState<"dark" | "light">(themeCourant);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Navigation privée ou stockage refusé : le thème reste appliqué pour la session.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant}`}
      onClick={toggle}
      aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      <Icon name="sun" className="ic-sun" />
      <Icon name="moon" className="ic-moon" />
    </button>
  );
}
