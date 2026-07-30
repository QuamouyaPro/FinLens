"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { JaugeRisque } from "./jauge-risque";
import { PuceCitation } from "./citations";
import type { NoteProfilContenu } from "@/types/domain";

type Props = {
  dossierId: string;
  note: NoteProfilContenu | null;
  nbDocumentsIndexes: number;
  extractionExiste: boolean;
};

export function PanneauSynthese({ dossierId, note, nbDocumentsIndexes, extractionExiste }: Props) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [noteComplete, setNoteComplete] = useState(false);

  async function analyser() {
    setEnCours(true);
    setErreur(null);

    try {
      const reponse = await fetch(`/api/dossiers/${dossierId}/analyser`, { method: "POST" });
      const donnees = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setErreur(donnees.error ?? "L'analyse a échoué.");
        return;
      }

      router.refresh();
    } catch {
      setErreur("Connexion interrompue pendant l'analyse. Relancez-la.");
    } finally {
      setEnCours(false);
    }
  }

  if (nbDocumentsIndexes === 0) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="doc" />
        </div>
        <b>Ce dossier attend ses premiers documents</b>
        Déposez un rapport annuel, une due diligence ou un bilan dans l&apos;onglet Documents. L&apos;analyse
        se lance ensuite en un clic.
      </div>
    );
  }

  if (!note) {
    return (
      <>
        {erreur ? (
          <p
            role="alert"
            className="badge badge--crit"
            style={{ height: "auto", padding: "11px 15px", marginBottom: 18, display: "block", lineHeight: 1.55 }}
          >
            {erreur}
          </p>
        ) : null}

        <div className="empty">
          <div className="ic">
            <Icon name="lens" />
          </div>
          <b>
            {extractionExiste
              ? "Aucune note pour ce profil"
              : `${nbDocumentsIndexes} document${nbDocumentsIndexes > 1 ? "s" : ""} indexé${nbDocumentsIndexes > 1 ? "s" : ""}, prêt pour l'analyse`}
          </b>
          <span style={{ display: "block", marginBottom: 18 }}>
            {extractionExiste
              ? "Sélectionnez un autre profil, ou relancez l'analyse pour régénérer les notes."
              : "L'analyse lit l'intégralité des documents une seule fois, puis en produit une lecture par profil. Chaque donnée reste sourcée à la page."}
          </span>
          <button type="button" className="btn btn--primary" onClick={analyser} disabled={enCours}>
            <Icon name="lens" style={{ width: 15, height: 15 }} />
            {enCours ? "Analyse en cours — cela peut prendre quelques minutes…" : "Lancer l'analyse"}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "11px 15px", marginBottom: 18, display: "block", lineHeight: 1.55 }}
        >
          {erreur}
        </p>
      ) : null}

      <JaugeRisque score={note.score_risque} axes={note.axes_risque ?? []} resume={note.resume_court} />

      {note.indicateurs_cles?.length ? (
        <>
          <div className="kpimini-head">
            <h3>Indicateurs clés</h3>
            <span>Sélectionnés pour ce profil — chaque valeur reste reliée à sa page source</span>
          </div>
          <div className="kpimini-grid">
            {note.indicateurs_cles.map((indicateur, index) => (
              <div
                className={`kpimini${indicateur.donnee_manquante ? " unsourced" : ""}`}
                key={`${indicateur.libelle}-${index}`}
              >
                <div className="l">{indicateur.libelle}</div>
                <div className="v">
                  {indicateur.donnee_manquante || indicateur.valeur === null ? (
                    <span className="faint" style={{ fontSize: 13 }}>
                      Non renseigné
                    </span>
                  ) : (
                    <>
                      {indicateur.valeur}
                      {indicateur.sources?.[0] ? <PuceCitation source={indicateur.sources[0]} /> : null}
                    </>
                  )}
                </div>
                {indicateur.donnee_manquante ? <span className="tag">absent des documents</span> : null}
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div className="block-h" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17 }}>Note d&apos;analyse</h2>
        <button type="button" onClick={() => setNoteComplete((o) => !o)}>
          {noteComplete ? "Replier la note" : "Déplier la note complète"}
        </button>
      </div>

      {(noteComplete ? note.note_complete : note.note_complete?.slice(0, 2))?.map((section) => (
        <div className="summary-sec" key={section.section}>
          <div className="sh">
            <span className="ic g">
              <Icon name="list" />
            </span>
            <h3>{section.section}</h3>
          </div>
          <ul>
            {section.contenu
              .split("\n")
              .filter((ligne) => ligne.trim())
              .map((ligne, index) => (
                <li key={index}>{ligne}</li>
              ))}
          </ul>
        </div>
      ))}

      <p className="engine-note">
        <Icon name="lens" />
        <span>
          Extraction du dossier par <b>Claude Fable 5</b>, reformulée pour ce profil par{" "}
          <b>Claude Sonnet 5</b>. Une donnée absente des documents est signalée plutôt qu&apos;estimée.
        </span>
      </p>

      <div style={{ marginTop: 22 }}>
        <button type="button" className="btn btn--ghost btn--sm" onClick={analyser} disabled={enCours}>
          {enCours ? "Analyse en cours…" : "Relancer l'analyse"}
        </button>
      </div>
    </>
  );
}
