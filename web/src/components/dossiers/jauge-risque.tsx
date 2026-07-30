import { niveauRisque, libelleRisque } from "@/lib/offres";

type Axe = { axe: string; poids: number; commentaire?: string };

const COULEURS = {
  lo: "var(--accent)",
  md: "var(--signal)",
  hi: "var(--danger)",
} as const;

/**
 * Jauge de risque du profil actif. Le score n'est pas unique : chaque profil
 * pondère ses propres axes, donc un même dossier peut apparaître peu risqué
 * pour un investisseur et très risqué pour un auditeur (section 9.2).
 */
export function JaugeRisque({
  score,
  axes,
  resume,
}: {
  score: number;
  axes: Axe[];
  resume: string;
}) {
  const niveau = niveauRisque(score);
  const couleur = COULEURS[niveau];

  const rayon = 52;
  const circonference = 2 * Math.PI * rayon;
  const rempli = (Math.min(Math.max(score, 0), 100) / 100) * circonference;

  return (
    <div className="riskbar">
      <div className="gauge">
        <svg width="128" height="128" viewBox="0 0 128 128" role="img" aria-label={`Score de risque ${score} sur 100`}>
          <circle cx="64" cy="64" r={rayon} fill="none" stroke="var(--surface-3)" strokeWidth="11" />
          <circle
            cx="64"
            cy="64"
            r={rayon}
            fill="none"
            stroke={couleur}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${rempli} ${circonference}`}
          />
        </svg>
        <div className="gv">
          <b style={{ color: couleur }}>{score}</b>
          <span>/ 100</span>
        </div>
      </div>

      <div className="rb">
        <h3>{libelleRisque(score)}</h3>
        <p>{resume}</p>

        <div className="rlines">
          {axes.map((axe) => {
            const niveauAxe = niveauRisque(axe.poids);
            return (
              <div className="rline" key={axe.axe} title={axe.commentaire}>
                <span className="rn">{axe.axe}</span>
                <span className="rt">
                  <i style={{ width: `${Math.min(axe.poids, 100)}%`, background: COULEURS[niveauAxe] }} />
                </span>
                <span className="rs" style={{ color: COULEURS[niveauAxe] }}>
                  {axe.poids}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
