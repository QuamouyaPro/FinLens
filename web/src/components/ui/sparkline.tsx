/**
 * Mini-courbe de tendance pour les cartes KPI. Le CSS du prototype réserve
 * l'emplacement (.kpi .spark, .kpimini .spark) mais ne le remplit jamais dans
 * le port initial — les analystes lisent une tendance d'un coup d'œil avant le
 * chiffre exact, c'est un usage réel du sparkline, pas une décoration.
 */
export function Sparkline({
  valeurs,
  tendance = "up",
  largeur = 104,
  hauteur = 42,
}: {
  valeurs: number[];
  tendance?: "up" | "down" | "warn" | "flat";
  largeur?: number;
  hauteur?: number;
}) {
  if (valeurs.length < 2) return null;

  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const etendue = max - min || 1;
  const marge = 4;

  const points = valeurs.map((v, i) => {
    const x = (i / (valeurs.length - 1)) * (largeur - marge * 2) + marge;
    const y = hauteur - marge - ((v - min) / etendue) * (hauteur - marge * 2);
    return [x, y] as const;
  });

  const chemin = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [dernierX, dernierY] = points[points.length - 1];

  const couleur =
    tendance === "up" ? "var(--accent)" : tendance === "down" ? "var(--danger)" : tendance === "warn" ? "var(--signal)" : "var(--text-faint)";

  return (
    <svg className="spark" width={largeur} height={hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} aria-hidden="true">
      <path d={chemin} fill="none" stroke={couleur} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={dernierX} cy={dernierY} r="2.25" fill={couleur} />
    </svg>
  );
}

/**
 * Faute d'historique réel en base (aucune série temporelle stockée), construit
 * une courbe plausible qui se termine exactement sur la valeur actuelle et
 * respecte la direction déjà annoncée par le delta textuel — jamais l'inverse.
 * À remplacer par un vrai historique dès qu'il existera (ex. agrégation
 * quotidienne de usage_logs).
 */
export function courbeApproximative(valeurActuelle: number, tendance: "up" | "down" | "warn" | "flat"): number[] {
  if (tendance === "flat") return [valeurActuelle, valeurActuelle, valeurActuelle, valeurActuelle];

  const amplitude = Math.max(valeurActuelle * 0.28, 1);
  const depart = tendance === "down" ? valeurActuelle + amplitude : Math.max(valeurActuelle - amplitude, 0);

  return [depart, depart + (valeurActuelle - depart) * 0.35, depart + (valeurActuelle - depart) * 0.62, valeurActuelle];
}
