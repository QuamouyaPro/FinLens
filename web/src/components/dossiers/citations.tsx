import { Icon } from "@/components/ui/icon";
import type { SourceCitation } from "@/types/domain";

/**
 * La puce de citation est la signature visuelle du produit : elle apparaît dans
 * la synthèse, le chat, les états financiers, le comparateur et les exports.
 * C'est la preuve vérifiable de la promesse « zéro hallucination ».
 */
export function PuceCitation({ source }: { source: SourceCitation }) {
  const libelle = source.page ? `p.${source.page}` : source.document;
  return (
    <span className="cite" title={`${source.document}${source.page ? ` — page ${source.page}` : ""}`}>
      <Icon name="lens" />
      {libelle}
    </span>
  );
}

export function ListeSources({ sources }: { sources: SourceCitation[] }) {
  if (!sources.length) return null;

  return (
    <div className="sources">
      <div className="lbl">Sources</div>
      <div className="sources__list">
        {sources.map((source, index) => (
          <span className="src-card" key={`${source.document}-${source.page}-${index}`}>
            <span className="pg">{source.page ? `p.${source.page}` : "—"}</span>
            <span className="fn">{source.document}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Une donnée absente du document est marquée, jamais estimée. */
export function ValeurIndicateur({ valeur, manquante }: { valeur: string | null; manquante: boolean }) {
  if (manquante || valeur === null) {
    return <span className="faint" style={{ fontSize: 13 }}>[DONNÉE MANQUANTE]</span>;
  }
  return <>{valeur}</>;
}
