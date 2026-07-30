import { Icon, type IconName } from "@/components/ui/icon";
import { Texte } from "./rendu";
import type { Kpi, SectionResume } from "@/lib/demo/types";

/** Couleurs de pastille du prototype : b=info, g=accent, o=signal, r=danger. */
const CLASSES_COULEUR: Record<string, string> = { b: "b", g: "g", o: "o", r: "r" };

const ICONES: Record<string, IconName> = {
  list: "list", check: "check", alert: "alert", star: "star",
  folder: "folder", lens: "lens", shield: "shield", split: "split",
  tbl: "tbl", clock: "clock", scale: "scale", bank: "bank",
};

function CarteKpi({ kpi }: { kpi: Kpi }) {
  const classeDelta =
    kpi.c === "up" ? "up" : kpi.c === "down" ? "down" : kpi.c === "warn" ? "warn" : "flat";

  return (
    <div className={`kpimini${kpi.src ? "" : " unsourced"}`}>
      <div className="l">{kpi.l}</div>
      <div className="v">
        {kpi.v}
        {kpi.src ? (
          <span className="cite">
            <Icon name="lens" />
            p.{kpi.src.slice(1)}
          </span>
        ) : null}
      </div>
      {kpi.d ? <div className={`d ${classeDelta}`}>{kpi.d}</div> : null}
      {!kpi.src ? <span className="tag">non sourcé</span> : null}
    </div>
  );
}

/**
 * Résumé exhaustif du profil actif : les blocs colorés du prototype
 * (lecture d'ensemble, points d'appui, zones de vigilance…), plus la grille
 * d'indicateurs propre au profil.
 */
export function ResumeProfil({
  sections,
  kpis,
}: {
  sections: SectionResume[];
  kpis: Kpi[];
}) {
  return (
    <>
      {kpis.length ? (
        <>
          <div className="kpimini-head">
            <h3>Indicateurs clés</h3>
            <span>Sélectionnés pour ce profil — chaque valeur renvoie à sa page source</span>
          </div>
          <div className="kpimini-grid">
            {kpis.map((kpi, i) => (
              <CarteKpi kpi={kpi} key={`${kpi.l}-${i}`} />
            ))}
          </div>
        </>
      ) : null}

      {sections.map(([couleur, icone, titre, items]) => (
        <div className="summary-sec" key={titre}>
          <div className="sh">
            <span className={`ic ${CLASSES_COULEUR[couleur] ?? "g"}`}>
              <Icon name={ICONES[icone] ?? "list"} />
            </span>
            <h3>{titre}</h3>
          </div>
          <ul>
            {items.map(([texte, alerte], i) => (
              <li className={alerte ? "warn" : undefined} key={i}>
                <Texte>{texte}</Texte>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
