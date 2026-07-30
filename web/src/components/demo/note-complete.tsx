"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Texte } from "./rendu";
import type { BlocNote, Profil, SectionNote } from "@/lib/demo/types";

/** Reproduit noteBlocks() du prototype. */
function Bloc({ bloc }: { bloc: BlocNote }) {
  const type = bloc[0];

  if (type === "p") {
    return (
      <p>
        <Texte>{bloc[1] as string}</Texte>
      </p>
    );
  }

  if (type === "h3") return <h3>{bloc[1] as string}</h3>;

  if (type === "ul" || type === "ulw" || type === "ulc") {
    const classe = type === "ulw" ? "warn" : type === "ulc" ? "crit" : undefined;
    return (
      <ul className={classe}>
        {(bloc[1] as string[]).map((item, i) => (
          <li key={i}>
            <Texte>{item}</Texte>
          </li>
        ))}
      </ul>
    );
  }

  if (type === "call" || type === "callw" || type === "callc") {
    const classe = type === "callw" ? " warn" : type === "callc" ? " crit" : "";
    return (
      <div className={`ncall${classe}`}>
        <b>{bloc[1] as string}</b>
        <Texte>{bloc[2] as string}</Texte>
      </div>
    );
  }

  if (type === "tbl") {
    const entetes = bloc[1] as string[];
    const lignes = bloc[2] as string[][];
    return (
      <table className="ntbl">
        <thead>
          <tr>
            {entetes.map((entete) => (
              <th key={entete} scope="col">
                {entete}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <tr key={i}>
              {ligne.map((cellule, j) => (
                <td key={j} className={j ? "mono" : undefined}>
                  {cellule}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
}

function Section({ section }: { section: SectionNote }) {
  return (
    <>
      <h2 id={`sec-${section.n}`}>
        <span className="num">{section.n}</span>
        {section.t}
      </h2>
      {section.lead ? <p className="lead2">{section.lead}</p> : null}
      {section.b.map((bloc, i) => (
        <Bloc bloc={bloc} key={i} />
      ))}
    </>
  );
}

/**
 * Note d'analyse complète (le « lecteur de note » du prototype) : 7 sections
 * numérotées, avec sommaire latéral. Ouverte en surcouche depuis la synthèse.
 */
export function NoteComplete({
  profil,
  nomDossier,
  onFermer,
}: {
  profil: Profil;
  nomDossier: string;
  onFermer: () => void;
}) {
  const [sectionActive, setSectionActive] = useState(0);

  function allerA(index: number) {
    setSectionActive(index);
    document.getElementById(`sec-${profil.note[index].n}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="reader is-open" role="dialog" aria-modal="true" aria-label="Note d'analyse complète">
      <div className="reader__head">
        <button type="button" className="iconbtn" onClick={onFermer} aria-label="Fermer la note">
          <Icon name="cross" />
        </button>
        <div className="rt">
          <b>Note d&apos;analyse — {nomDossier}</b>
          <span>
            Profil {profil.label} · {profil.note.length} sections
          </span>
        </div>
        <div className="acts">
          <span className="badge badge--muted">Démonstration</span>
        </div>
      </div>

      <div className="reader__body">
        <nav className="reader__toc" aria-label="Sommaire de la note">
          <div className="tl">Sommaire</div>
          {profil.note.map((section, index) => (
            <a
              key={section.n}
              className={index === sectionActive ? "is-active" : undefined}
              onClick={() => allerA(index)}
              style={{ cursor: "pointer" }}
            >
              <span className="num">{section.n}</span>
              {section.t}
            </a>
          ))}
        </nav>

        <div className="reader__scroll">
          <article className="note">
          <div className="note__cover">
            <div className="kk">Note d&apos;analyse · confidentiel</div>
            <h1>{nomDossier}</h1>
            <div className="sb">{profil.lens ?? profil.tag}</div>
            <div className="note__meta">
              <div>
                <div className="l">Profil</div>
                <div className="v">{profil.short}</div>
              </div>
              <div>
                <div className="l">Score de risque</div>
                <div className="v">{profil.score} / 100</div>
              </div>
              <div>
                <div className="l">Sections</div>
                <div className="v">{profil.note.length}</div>
              </div>
              <div>
                <div className="l">Sources</div>
                <div className="v">Citées à la page</div>
              </div>
            </div>
          </div>

          {profil.note.map((section) => (
            <Section section={section} key={section.n} />
          ))}

            <p className="note__end">
              Note générée par FinLens à partir des documents indexés du dossier. Chaque donnée
              chiffrée renvoie à sa page source ; une information absente des documents est signalée
              comme telle plutôt qu&apos;estimée. Contenu de démonstration — aucun appel réel n&apos;a
              été effectué.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
