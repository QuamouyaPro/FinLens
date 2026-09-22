"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import type { SourceCitation } from "@/types/domain";

/**
 * Panneau latéral ouvert par une puce de citation cliquée — la signature du
 * produit (Note de fonctionnement, §17.3) : reproduit la page du document
 * source, passage surligné. Sans stockage du PDF original, la page rendue
 * est une reconstruction typographique du seul passage cité (extrait
 * retourné par le moteur), pas un fac-similé pixel du PDF.
 */
export function PanneauSource({ source, onClose }: { source: SourceCitation | null; onClose: () => void }) {
  useEffect(() => {
    if (!source) return;
    function surEchap(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", surEchap);
    return () => window.removeEventListener("keydown", surEchap);
  }, [source, onClose]);

  return (
    <>
      <div className={`spanel-bg${source ? " is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      <div className={`spanel${source ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Source citée">
        {source ? (
          <>
            <div className="spanel__h">
              <Icon name="lens" className="lens" />
              <div className="t">
                <b>{source.document}</b>
                <span>{source.page ? `Page ${source.page}` : "Page non précisée"}</span>
              </div>
              <button type="button" className="spanel__close" onClick={onClose} aria-label="Fermer">
                <Icon name="cross" />
              </button>
            </div>
            <div className="spanel__body">
              <div className="pdf-page">
                <div className="ph">
                  <span>{source.document}</span>
                  <span>{source.page ? `p. ${source.page}` : "—"}</span>
                </div>
                <h4>Passage cité</h4>
                <p>
                  <mark>{source.extrait}</mark>
                </p>
                <div className="pf">Extrait reconstruit à partir du document indexé — pas un fac-similé du PDF original.</div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
