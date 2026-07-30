"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LIENS = [
  { href: "#produit", label: "Produit" },
  { href: "#comparatif", label: "Pourquoi FinLens" },
  { href: "#roi", label: "ROI" },
  { href: "#fiabilite", label: "Sécurité" },
  { href: "#tarifs", label: "Tarifs" },
];

export function TopbarPublique({ connecte }: { connecte: boolean }) {
  const [tiroirOuvert, setTiroirOuvert] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__in">
        <Link href="/">
          <Logo />
        </Link>

        <nav>
          {LIENS.map((lien) => (
            <a key={lien.href} href={lien.href}>
              {lien.label}
            </a>
          ))}
        </nav>

        <div className="topbar__actions">
          <ThemeToggle />
          {connecte ? (
            <Link href="/tableau-de-bord" className="btn btn--primary btn--sm">
              Ouvrir la plateforme
            </Link>
          ) : (
            <>
              <Link href="/connexion" className="btn btn--ghost btn--sm">
                Se connecter
              </Link>
              <Link href="/inscription" className="btn btn--primary btn--sm">
                Créer un compte
              </Link>
            </>
          )}
          <button
            type="button"
            className="iconbtn topbar-menu-btn"
            onClick={() => setTiroirOuvert((o) => !o)}
            aria-label="Ouvrir le menu"
            aria-expanded={tiroirOuvert}
          >
            <Icon name="menu" />
          </button>
        </div>

        <div className={`topbar-drawer${tiroirOuvert ? " is-open" : ""}`}>
          {LIENS.map((lien) => (
            <a key={lien.href} href={lien.href} onClick={() => setTiroirOuvert(false)}>
              {lien.label}
            </a>
          ))}
          <div className="tdiv" />
          {connecte ? (
            <Link href="/tableau-de-bord" onClick={() => setTiroirOuvert(false)}>
              Ouvrir la plateforme
            </Link>
          ) : (
            <>
              <Link href="/connexion" onClick={() => setTiroirOuvert(false)}>
                Se connecter
              </Link>
              <Link href="/inscription" onClick={() => setTiroirOuvert(false)}>
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
