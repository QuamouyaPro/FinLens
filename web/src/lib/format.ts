/** Dates relatives en français, comme dans le prototype (« il y a 2 h », « hier »). */
export function dateRelative(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(delta / 60_000);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;

  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures} h`;

  const jours = Math.floor(heures / 24);
  if (jours === 1) return "hier";
  if (jours < 7) return `il y a ${jours} j`;
  if (jours < 14) return "la semaine dernière";
  if (jours < 60) return `il y a ${Math.floor(jours / 7)} sem.`;

  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function dateCourte(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function euros(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(montant);
}

export function nombre(valeur: number): string {
  return new Intl.NumberFormat("fr-FR").format(valeur);
}

/** Initiale servant de vignette de dossier. */
export function initiale(nom: string): string {
  return nom.trim()[0]?.toUpperCase() ?? "?";
}
