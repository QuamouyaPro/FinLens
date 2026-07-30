"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_COMPTE, NAV_PRINCIPALE, type NavItem } from "./nav-items";
import { OFFRES } from "@/lib/offres";
import type { Enums } from "@/types/database";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
  onOuvrirPalette: () => void;
  offre: Enums<"offre">;
  nomUtilisateur: string;
  nomOrganisation: string;
  dossiersActifs: number;
  signauxOuverts: number;
};

export function Sidebar({
  ouvert,
  onFermer,
  onOuvrirPalette,
  offre,
  nomUtilisateur,
  nomOrganisation,
  dossiersActifs,
  signauxOuverts,
}: Props) {
  const pathname = usePathname();
  const config = OFFRES[offre];
  const plafond = config.dossiersActifsMax;

  const initiales = nomUtilisateur
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((mot) => mot[0]?.toUpperCase())
    .join("") || "?";

  function rendreItem(item: NavItem) {
    const actif = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const compte =
      item.compteur === "dossiers" ? dossiersActifs : item.compteur === "signaux" ? signauxOuverts : null;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`nav__item${actif ? " is-active" : ""}`}
        aria-current={actif ? "page" : undefined}
        onClick={onFermer}
      >
        <Icon name={item.icon} />
        {item.label}
        {compte !== null && compte > 0 ? (
          <span className={`count${item.compteur === "signaux" ? " alert" : ""}`}>{compte}</span>
        ) : null}
        {item.offresPro && offre === "essentiel" ? (
          <Icon name="lock" style={{ marginLeft: "auto", width: 13, height: 13, opacity: 0.55 }} />
        ) : null}
      </Link>
    );
  }

  return (
    <aside className={`sidebar noise${ouvert ? " is-open" : ""}`}>
      <div className="sidebar__top">
        <Logo size={16.5} />
        <ThemeToggle variant="ink" />
      </div>

      <button type="button" className="cmdk-btn" onClick={onOuvrirPalette}>
        <Icon name="srch" />
        Rechercher partout…
        <span className="kbd">⌘K</span>
      </button>

      <nav className="nav">
        {NAV_PRINCIPALE.map(rendreItem)}
        <div className="nav__label">Compte</div>
        {NAV_COMPTE.filter((item) => !item.offreFonds || offre === "fonds").map(rendreItem)}
      </nav>

      <div className="slots">
        <div className="h">
          <span>Espace de travail</span>
          <Link href="/dossiers">Gérer</Link>
        </div>
        <div className="row">
          <span>Dossiers ouverts</span>
          <span className="mono">
            {dossiersActifs} / {plafond}
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 100,
            background: "rgba(255,255,255,.08)",
            overflow: "hidden",
            margin: "8px 0 4px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min((dossiersActifs / plafond) * 100, 100)}%`,
              background: "var(--ink-accent)",
              borderRadius: 100,
            }}
          />
        </div>
        <div className="inf">
          <Icon name="lens" />
          {config.questionsParMois === null ? (
            <span>
              Questions &amp; analyses : <b>illimitées</b>
            </span>
          ) : (
            <span>
              Quota mensuel : <b>{config.questionsParMois} questions</b>
            </span>
          )}
        </div>
      </div>

      <Link href="/reglages" className="userchip" onClick={onFermer}>
        <span className="avatar">{initiales}</span>
        <span className="who">
          {nomUtilisateur}
          <span>{nomOrganisation}</span>
        </span>
        <span className="plan-pill">{config.label.toUpperCase()}</span>
      </Link>
    </aside>
  );
}
