"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Sidebar } from "./sidebar";
import { CommandPalette, type DossierRaccourci } from "./command-palette";
import type { Enums } from "@/types/database";

type Props = {
  children: React.ReactNode;
  offre: Enums<"offre">;
  nomUtilisateur: string;
  nomOrganisation: string;
  dossiersActifs: number;
  signauxOuverts: number;
  dossiersRaccourcis: DossierRaccourci[];
};

export function AppShell({
  children,
  offre,
  nomUtilisateur,
  nomOrganisation,
  dossiersActifs,
  signauxOuverts,
  dossiersRaccourcis,
}: Props) {
  const [tiroirOuvert, setTiroirOuvert] = useState(false);
  const [paletteOuverte, setPaletteOuverte] = useState(false);

  const fermerTiroir = useCallback(() => setTiroirOuvert(false), []);

  // ⌘K / Ctrl+K ouvre la palette depuis n'importe quel écran.
  useEffect(() => {
    function surTouche(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOuverte((ouverte) => !ouverte);
      }
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, []);

  return (
    <div className="app is-active">
      <Sidebar
        ouvert={tiroirOuvert}
        onFermer={fermerTiroir}
        onOuvrirPalette={() => setPaletteOuverte(true)}
        offre={offre}
        nomUtilisateur={nomUtilisateur}
        nomOrganisation={nomOrganisation}
        dossiersActifs={dossiersActifs}
        signauxOuverts={signauxOuverts}
      />

      {/* Fond assombri cliquable : referme le tiroir sur petit écran. */}
      <div
        className={`nav-bg${tiroirOuvert ? " is-open" : ""}`}
        onClick={fermerTiroir}
        aria-hidden="true"
      />

      <div className="main">
        <header className="appbar">
          <div className="ab-left">
            <button
              type="button"
              className="iconbtn mobile-menu-btn"
              onClick={() => setTiroirOuvert(true)}
              aria-label="Ouvrir la navigation"
            >
              <Icon name="menu" />
            </button>
            <div className="crumb">
              <b>{nomOrganisation}</b>
            </div>
          </div>

          <div className="appbar__actions">
            <button
              type="button"
              className="search"
              onClick={() => setPaletteOuverte(true)}
              aria-label="Rechercher partout"
            >
              <Icon name="srch" />
              <span style={{ flex: 1, textAlign: "left", fontSize: 13.5 }}>Rechercher partout…</span>
              <span className="kbd">⌘K</span>
            </button>

            <Link href="/signaux" className="iconbtn" aria-label={`Signaux (${signauxOuverts} non traités)`}>
              <Icon name="alert" />
              {signauxOuverts > 0 ? <span className="ping" /> : null}
            </Link>

            <Link href="/dossiers?nouveau=1" className="btn btn--primary btn--sm">
              <Icon name="plus" style={{ width: 15, height: 15 }} />
              Nouveau dossier
            </Link>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>

      {paletteOuverte ? (
        <CommandPalette onFermer={() => setPaletteOuverte(false)} dossiers={dossiersRaccourcis} />
      ) : null}
    </div>
  );
}
