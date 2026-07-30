import { Fragment } from "react";
import { Icon } from "@/components/ui/icon";
import sourcesJson from "@/lib/demo/data/sources.json";

type SourceDetail = { doc: string; page: number; section: string; paras: string[] };
const SOURCES = sourcesJson as Record<string, SourceDetail>;

export function detailSource(cle: string): SourceDetail | undefined {
  return SOURCES[cle];
}

/**
 * Reproduit expandCites() du prototype : les marqueurs {p148} deviennent des
 * puces de citation, et les <b>…</b> du texte source restent en gras. Le texte
 * étant écrit à la main dans le prototype (aucune saisie utilisateur), il n'y a
 * pas de risque d'injection ; on construit malgré tout des nœuds React plutôt
 * que d'utiliser dangerouslySetInnerHTML.
 */
export function Texte({ children }: { children: string }) {
  const noeuds: React.ReactNode[] = [];
  let gras = false;
  let surligne = false;

  // Boucle explicite plutôt que .map() : l'état « gras / surligné » se propage
  // d'un morceau au suivant, ce qui n'a pas sa place dans un callback de rendu.
  children.split(/(\{[a-z]\d+\}|<\/?b>|<\/?mark>)/g).forEach((morceau, index) => {
    if (morceau === "<b>") {
      gras = true;
      return;
    }
    if (morceau === "</b>") {
      gras = false;
      return;
    }
    if (morceau === "<mark>") {
      surligne = true;
      return;
    }
    if (morceau === "</mark>") {
      surligne = false;
      return;
    }
    if (!morceau) return;

    const citation = morceau.match(/^\{([a-z]\d+)\}$/);
    if (citation) {
      const cle = citation[1];
      const source = SOURCES[cle];
      noeuds.push(
        <span
          className="cite"
          key={index}
          title={source ? `${source.doc} — page ${source.page}` : undefined}
        >
          <Icon name="lens" />
          p.{source ? source.page : cle.slice(1)}
        </span>
      );
      return;
    }

    if (surligne) {
      noeuds.push(
        <mark key={index} className="surligne">
          {morceau}
        </mark>
      );
      return;
    }

    noeuds.push(
      gras ? <b key={index}>{morceau}</b> : <Fragment key={index}>{morceau}</Fragment>
    );
  });

  return <>{noeuds}</>;
}

/** Carte de source cliquable (le panneau latéral du prototype). */
export function CarteSource({ cle, libelle }: { cle: string; libelle?: string }) {
  const source = SOURCES[cle];
  return (
    <span className="src-card" title={source?.section}>
      <span className="pg">p.{source ? source.page : cle.slice(1)}</span>
      <span className="fn">{libelle ?? source?.doc ?? cle}</span>
    </span>
  );
}
