"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import { NAV_COMPTE, NAV_PRINCIPALE } from "./nav-items";

export type DossierRaccourci = { id: string; name: string; secteur: string | null };

type Entree = {
  id: string;
  groupe: string;
  label: string;
  detail?: string;
  icon: IconName;
  href: string;
  hint?: string;
};

type Props = {
  onFermer: () => void;
  dossiers: DossierRaccourci[];
  /** Préfixe des liens (ex. "/demo") pour réutiliser la palette hors session réelle. */
  base?: string;
};

/**
 * Palette de commandes (⌘K). Regroupe actions rapides, navigation et recherche
 * par nom de dossier, avec navigation clavier complète (flèches, entrée, échap).
 * Monté à l'ouverture uniquement : la saisie repart donc vierge à chaque fois,
 * sans effet de réinitialisation.
 */
export function CommandPalette({ onFermer, dossiers, base = "" }: Props) {
  const router = useRouter();
  const [requete, setRequete] = useState("");
  const [selection, setSelection] = useState(0);

  const entrees = useMemo<Entree[]>(() => {
    const actions: Entree[] = [
      {
        id: "action-nouveau",
        groupe: "Actions",
        label: "Créer un dossier",
        detail: "Un espace de travail par entreprise étudiée",
        icon: "plus",
        href: `${base}/dossiers?nouveau=1`,
        hint: "N",
      },
      {
        id: "action-recherche",
        groupe: "Actions",
        label: "Interroger tous les dossiers",
        detail: "Une question, tous les dossiers actifs",
        icon: "srch",
        href: `${base}/recherche`,
      },
    ];

    const navigation: Entree[] = [...NAV_PRINCIPALE, ...NAV_COMPTE].map((item) => ({
      id: `nav-${item.href}`,
      groupe: "Navigation",
      label: item.label,
      icon: item.icon,
      href: `${base}${item.href}`,
    }));

    const dossiersEntrees: Entree[] = dossiers.map((d) => ({
      id: `dossier-${d.id}`,
      groupe: "Dossiers",
      label: d.name,
      detail: d.secteur ?? undefined,
      icon: "folder",
      href: `${base}/dossiers/${d.id}`,
    }));

    return [...actions, ...navigation, ...dossiersEntrees];
  }, [dossiers, base]);

  const resultats = useMemo(() => {
    const q = requete.trim().toLowerCase();
    if (!q) return entrees.slice(0, 12);
    return entrees
      .filter((e) => `${e.label} ${e.detail ?? ""}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [entrees, requete]);

  function ouvrir(entree: Entree | undefined) {
    if (!entree) return;
    onFermer();
    router.push(entree.href);
  }

  function surTouche(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelection((s) => (s + 1) % Math.max(resultats.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelection((s) => (s - 1 + resultats.length) % Math.max(resultats.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      ouvrir(resultats[selection]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onFermer();
    }
  }

  let groupeCourant = "";

  return (
    <div
      className="cmdk-bg is-open"
      role="dialog"
      aria-modal="true"
      aria-label="Palette de commandes"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFermer();
      }}
    >
      <div className="cmdk" onKeyDown={surTouche}>
        <div className="cmdk__in">
          <Icon name="srch" />
          <input
            autoFocus
            value={requete}
            onChange={(e) => {
              setRequete(e.target.value);
              setSelection(0);
            }}
            placeholder="Rechercher un dossier, une action, une page…"
            aria-label="Rechercher"
          />
          <span className="esc">ESC</span>
        </div>

        <div className="cmdk__list">
          {resultats.length === 0 ? (
            <p style={{ padding: "22px 12px", color: "var(--text-faint)", fontSize: 13.5 }}>
              Aucun résultat pour « {requete} ».
            </p>
          ) : (
            resultats.map((entree, index) => {
              const nouveauGroupe = entree.groupe !== groupeCourant;
              groupeCourant = entree.groupe;
              return (
                <div key={entree.id}>
                  {nouveauGroupe ? <div className="cmdk__gt">{entree.groupe}</div> : null}
                  <div
                    className={`cmdk__i${index === selection ? " sel" : ""}`}
                    onMouseEnter={() => setSelection(index)}
                    onClick={() => ouvrir(entree)}
                    role="button"
                    tabIndex={-1}
                  >
                    <span className="ic">
                      <Icon name={entree.icon} />
                    </span>
                    <span className="tx">
                      <b>{entree.label}</b>
                      {entree.detail ? <span>{entree.detail}</span> : null}
                    </span>
                    {entree.hint ? <span className="hint">{entree.hint}</span> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cmdk__f">
          <span>
            <b>↑</b> <b>↓</b> naviguer
          </span>
          <span>
            <b>↵</b> ouvrir
          </span>
          <span>
            <b>esc</b> fermer
          </span>
        </div>
      </div>
    </div>
  );
}
