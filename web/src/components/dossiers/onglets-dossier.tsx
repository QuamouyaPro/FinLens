"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";

export type Onglet = {
  cle: string;
  label: string;
  icon: IconName;
  /** Compteur ou pastille affichés à droite du libellé. */
  compteur?: number;
  alerte?: boolean;
  contenu: React.ReactNode;
};

export function OngletsDossier({ onglets }: { onglets: Onglet[] }) {
  const [actif, setActif] = useState(onglets[0]?.cle);

  return (
    <>
      <div className="subnav" role="tablist" aria-label="Sections du dossier">
        {onglets.map((onglet) => (
          <button
            key={onglet.cle}
            type="button"
            role="tab"
            aria-selected={actif === onglet.cle}
            className={`subnav__tab${actif === onglet.cle ? " is-active" : ""}`}
            onClick={() => setActif(onglet.cle)}
          >
            <Icon name={onglet.icon} />
            {onglet.label}
            {onglet.compteur ? <span className="mono">{onglet.compteur}</span> : null}
            {onglet.alerte ? <span className="pip" /> : null}
          </button>
        ))}
      </div>

      {onglets.map((onglet) => (
        <div
          key={onglet.cle}
          className={`dpanel${actif === onglet.cle ? " is-active" : ""}`}
          role="tabpanel"
        >
          {actif === onglet.cle ? onglet.contenu : null}
        </div>
      ))}
    </>
  );
}
