"use client";

/**
 * Lien d'ancrage qui défile en douceur au lieu de naviguer. Un <a href="#x">
 * ordinaire pousse une entrée d'historique à chaque clic : en enchaîner
 * plusieurs (Produit → ROI → Tarifs) oblige ensuite à cliquer "retour" autant
 * de fois pour quitter la page, au lieu d'un seul retour vers l'écran
 * précédent. On garde le lien ancre pour les moteurs de recherche et le
 * clic milieu/ouverture dans un nouvel onglet, mais on intercepte le clic
 * simple pour ne remplacer que le hash, sans empiler l'historique.
 */
export function AncreDouce({
  cible,
  className,
  onApresClic,
  children,
}: {
  cible: string;
  className?: string;
  /** Appelé après le défilement, par ex. pour refermer un tiroir mobile. */
  onApresClic?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${cible}`}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        const element = document.getElementById(cible);
        if (!element) return;

        event.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${cible}`);
        onApresClic?.();
      }}
    >
      {children}
    </a>
  );
}
