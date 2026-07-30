"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Source = { cle: string; page: string; titre: string };
type Question = { q: string; reponse: string; sources: Source[] };

/**
 * Démonstration interactive de la promesse « zéro hallucination » : le visiteur
 * teste lui-même une réponse sourcée avant de créer un compte. Les réponses
 * portent sur un rapport annuel public et sont figées — c'est une démonstration,
 * pas un appel au moteur.
 */
const QUESTIONS: Question[] = [
  {
    q: "Évolution des marges opérationnelles sur 3 ans ?",
    reponse:
      "La marge opérationnelle recule de {b}26,6 % à 25,6 %{/b} entre 2022 et 2024 {p148}. La direction l'attribue à l'accélération des investissements retail et à un effet de change défavorable d'environ 40 points de base {p151}, tout en soulignant la résilience de la division Mode & Maroquinerie, dont la marge reste supérieure à celle du Groupe {p62}.",
    sources: [
      { cle: "p148", page: "p.148", titre: "Compte de résultat" },
      { cle: "p151", page: "p.151", titre: "Commentaire de gestion" },
      { cle: "p62", page: "p.62", titre: "Revue des divisions" },
    ],
  },
  {
    q: "Y a-t-il des covenants bancaires ?",
    reponse:
      "{b}Aucun covenant financier{/b} dans les financements du Groupe : ni les emprunts obligataires, ni les 12,2 Md€ de lignes confirmées non tirées {p171}. Seules s'appliquent les clauses usuelles de pari passu et de negative pledge {p171}. La structure reste conservatrice à 0,9× EBITDA {p153}.",
    sources: [
      { cle: "p171", page: "p.171", titre: "Note 18 — Emprunts" },
      { cle: "p153", page: "p.153", titre: "Structure de la dette" },
    ],
  },
  {
    q: "Quels risques sont enterrés dans les annexes ?",
    reponse:
      "Deux éléments ne figurent que dans les notes annexes. D'abord une sensibilité accrue à la demande chinoise, susceptible d'affecter significativement les volumes de la division principale — {b}non quantifiée dans le corps du rapport{/b} {p187}. Ensuite une progression des stocks (+11,3 %) supérieure à celle du chiffre d'affaires (+10,5 %), qui alourdit le besoin en fonds de roulement {p160}.",
    sources: [
      { cle: "p187", page: "p.187", titre: "Note 34 — Facteurs de risque" },
      { cle: "p160", page: "p.160", titre: "Bilan — Actif circulant" },
    ],
  },
  {
    q: "Quel est le niveau réel de génération de trésorerie ?",
    reponse:
      "Le free cash-flow atteint {b}10,5 Md€{/b}, en progression de 4,2 %, couvrant largement le service de la dette et le programme de distribution {p148}. Rapporté à une dette nette de 19,8 Md€, cela représente un ratio de couverture confortable, que le Groupe qualifie lui-même de conservateur {p153}.",
    sources: [
      { cle: "p148", page: "p.148", titre: "Compte de résultat" },
      { cle: "p153", page: "p.153", titre: "Structure de la dette" },
    ],
  },
];

/** Transforme les marqueurs {p148} en puces de citation et {b}…{/b} en gras. */
function rendreReponse(texte: string) {
  const morceaux = texte.split(/(\{p\d+\}|\{b\}|\{\/b\})/g);
  const noeuds: React.ReactNode[] = [];
  let gras = false;

  morceaux.forEach((morceau, index) => {
    if (morceau === "{b}") {
      gras = true;
      return;
    }
    if (morceau === "{/b}") {
      gras = false;
      return;
    }

    const citation = morceau.match(/^\{p(\d+)\}$/);
    if (citation) {
      noeuds.push(
        <span className="cite" key={index}>
          <Icon name="lens" />
          p.{citation[1]}
        </span>
      );
      return;
    }

    if (!morceau) return;
    noeuds.push(gras ? <b key={index}>{morceau}</b> : <span key={index}>{morceau}</span>);
  });

  return noeuds;
}

export function DemoCopilote() {
  const [indexActif, setIndexActif] = useState(0);
  const [reflexion, setReflexion] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  function jouer(index: number) {
    if (minuteur.current) clearTimeout(minuteur.current);
    setIndexActif(index);
    setReflexion(true);
    minuteur.current = setTimeout(() => setReflexion(false), 900);
  }

  useEffect(() => {
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    };
  }, []);

  const question = QUESTIONS[indexActif];

  return (
    <div className="demo">
      <div className="demo__bar">
        <Icon name="lens" className="lens" />
        <span className="t">Copilote · Rapport annuel 2024</span>
        <span className="badge badge--ok">Démo</span>
      </div>

      <div className="demo__body">
        <div className="demo__q">{question.q}</div>

        {reflexion ? (
          <div className="typing" aria-live="polite" aria-label="Le Copilote rédige la réponse">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <div className="demo__a">
            <p>{rendreReponse(question.reponse)}</p>
            <div className="demo__srcs">
              <div className="lbl">Sources — la page exacte, pas le document entier</div>
              <div className="sources__list">
                {question.sources.map((source) => (
                  <span className="src-card" key={source.cle}>
                    <span className="pg">{source.page}</span>
                    <span className="fn">{source.titre}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="demo__ask">
        <div className="lbl">Essayez — choisissez une question</div>
        <div className="demo__chips">
          {QUESTIONS.map((item, index) => (
            <button
              key={item.q}
              type="button"
              className={index === indexActif ? "is-active" : ""}
              onClick={() => jouer(index)}
            >
              {item.q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
