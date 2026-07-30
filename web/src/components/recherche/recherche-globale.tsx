"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

type Resultat = {
  chunk_id: string;
  dossier_id: string;
  dossier_name: string;
  document_name: string;
  page_number: number | null;
  content: string;
  similarity: number;
};

const SUGGESTIONS = [
  "covenants bancaires",
  "clause de liquidation préférentielle",
  "revenus récurrents",
  "concentration client",
];

export function RechercheGlobale({ aDesDocuments }: { aDesDocuments: boolean }) {
  const [question, setQuestion] = useState("");
  const [resultats, setResultats] = useState<Resultat[] | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function chercher(texte: string) {
    const requete = texte.trim();
    if (requete.length < 2) return;

    setQuestion(requete);
    setEnCours(true);
    setErreur(null);

    try {
      const reponse = await fetch("/api/recherche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: requete }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.error ?? "La recherche a échoué.");
        return;
      }

      setResultats(donnees.resultats ?? []);
    } catch {
      setErreur("Connexion interrompue. Relancez la recherche.");
    } finally {
      setEnCours(false);
    }
  }

  if (!aDesDocuments) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="srch" />
        </div>
        <b>Rien à chercher pour l&apos;instant</b>
        La recherche globale interroge tous vos dossiers actifs à la fois. Déposez d&apos;abord des
        documents dans un dossier.
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          chercher(question);
        }}
        style={{ marginBottom: 18 }}
      >
        <div className="field" style={{ marginBottom: 12 }}>
          <input
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Une question posée à tous vos dossiers actifs à la fois…"
            aria-label="Rechercher dans tous les dossiers"
            style={{ height: 52, fontSize: 15.5 }}
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={enCours || question.trim().length < 2}>
          <Icon name="srch" style={{ width: 15, height: 15 }} />
          {enCours ? "Recherche…" : "Chercher"}
        </button>
      </form>

      <div className="qpacks" style={{ marginBottom: 24 }}>
        <span className="lb">Recherches fréquentes</span>
        {SUGGESTIONS.map((suggestion) => (
          <button key={suggestion} type="button" className="qpack" onClick={() => chercher(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "11px 15px", marginBottom: 18, display: "block", lineHeight: 1.55 }}
        >
          {erreur}
        </p>
      ) : null}

      {resultats !== null ? (
        resultats.length === 0 ? (
          <div className="empty">
            <div className="ic">
              <Icon name="srch" />
            </div>
            <b>Aucun passage ne correspond</b>
            Aucun de vos dossiers actifs ne contient de passage proche de « {question} ».
          </div>
        ) : (
          <>
            <div className="block-h">
              <h2>
                {resultats.length} passage{resultats.length > 1 ? "s" : ""} trouvé
                {resultats.length > 1 ? "s" : ""}
              </h2>
            </div>

            {resultats.map((resultat) => (
              <Link
                href={`/dossiers/${resultat.dossier_id}`}
                className="card"
                key={resultat.chunk_id}
                style={{ display: "block", marginBottom: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <b style={{ fontSize: 14.5 }}>{resultat.dossier_name}</b>
                  <span className="src-card" style={{ pointerEvents: "none" }}>
                    <span className="pg">{resultat.page_number ? `p.${resultat.page_number}` : "—"}</span>
                    <span className="fn">{resultat.document_name}</span>
                  </span>
                </div>
                <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  {resultat.content.slice(0, 340)}
                  {resultat.content.length > 340 ? "…" : ""}
                </p>
              </Link>
            ))}
          </>
        )
      ) : null}
    </>
  );
}
