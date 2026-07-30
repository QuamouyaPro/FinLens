"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PROFIL_LABELS_COURTS } from "@/lib/offres";
import type { Enums } from "@/types/database";
import type { SourceCitation } from "@/types/domain";

type Message = {
  id: string;
  role: Enums<"chat_role">;
  content: string;
  sources: SourceCitation[];
  complexity_label: string | null;
  epingle?: boolean;
};

/** Questions suggérées selon le type d'opération (Note de fonctionnement, 7). */
const PACKS: Record<Enums<"type_operation">, string[]> = {
  due_diligence: [
    "Y a-t-il des covenants bancaires ?",
    "Quels litiges sont en cours et sont-ils provisionnés ?",
    "Quelle est la concentration clients ?",
    "Quels risques sont enterrés dans les annexes ?",
  ],
  lbo: [
    "Quel est le levier actuel (dette nette / EBITDA) ?",
    "Quelle est la capacité de remboursement ?",
    "Y a-t-il un earn-out ou un crédit-vendeur ?",
    "Quelle est la marge par rapport aux covenants ?",
  ],
  serie_a_b: [
    "Quelle est la table de capitalisation ?",
    "Y a-t-il une clause de liquidation préférentielle ?",
    "Quel est le runway actuel ?",
    "Quelle part du CA est récurrente ?",
  ],
  screening: [
    "Quelle est l'évolution des marges sur 3 ans ?",
    "Quel est le niveau de génération de trésorerie ?",
    "Quelle est la position concurrentielle ?",
    "Quels sont les principaux signaux de risque ?",
  ],
  veille: [
    "Comment se situent les marges face aux pairs ?",
    "Quelle est la croissance comparée au secteur ?",
    "Quels engagements ESG sont déclarés ?",
    "Quelle est la stratégie annoncée par la direction ?",
  ],
};

type Props = {
  dossierId: string;
  typeOperation: Enums<"type_operation">;
  profilActif: Enums<"profil_analyse">;
  messagesInitiaux: Message[];
  nbDocumentsIndexes: number;
};

export function Copilote({
  dossierId,
  typeOperation,
  profilActif,
  messagesInitiaux,
  nbDocumentsIndexes,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(messagesInitiaux);
  const [question, setQuestion] = useState("");
  const [enAttente, setEnAttente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const flux = useRef<HTMLDivElement>(null);
  /** Identifiants locaux des messages en attente de l'identifiant serveur. */
  const compteurLocal = useRef(0);

  useEffect(() => {
    flux.current?.scrollTo({ top: flux.current.scrollHeight, behavior: "smooth" });
  }, [messages, enAttente]);

  async function envoyer(texte: string) {
    const contenu = texte.trim();
    if (!contenu || enAttente) return;

    setErreur(null);
    setQuestion("");
    setEnAttente(true);

    compteurLocal.current += 1;
    const messageUtilisateur: Message = {
      id: `local-${compteurLocal.current}`,
      role: "user",
      content: contenu,
      sources: [],
      complexity_label: null,
    };
    setMessages((precedents) => [...precedents, messageUtilisateur]);

    try {
      const reponse = await fetch("/api/copilote/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossier_id: dossierId, question: contenu }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.error ?? "Le Copilote n'a pas pu répondre.");
        return;
      }

      setMessages((precedents) => [
        ...precedents,
        {
          id: donnees.message.id,
          role: "assistant",
          content: donnees.message.content,
          sources: (donnees.message.sources ?? []) as SourceCitation[],
          complexity_label: donnees.message.complexity_label,
        },
      ]);
    } catch {
      setErreur("Connexion interrompue. Votre question n'a pas été envoyée.");
    } finally {
      setEnAttente(false);
    }
  }

  async function epingler(message: Message) {
    const reponse = await fetch("/api/copilote/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dossier_id: dossierId,
        chat_message_id: message.id,
        profil_cible: null,
      }),
    });

    if (reponse.ok) {
      setMessages((precedents) =>
        precedents.map((m) => (m.id === message.id ? { ...m, epingle: true } : m))
      );
    } else {
      const donnees = await reponse.json().catch(() => ({}));
      setErreur(donnees.error ?? "L'ajout à la note a échoué.");
    }
  }

  if (nbDocumentsIndexes === 0) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="chat" />
        </div>
        <b>Le Copilote a besoin de documents pour répondre</b>
        Déposez au moins un document dans l&apos;onglet Documents. Le Copilote ne répond qu&apos;à partir
        des pièces de ce dossier — c&apos;est ce qui garantit que chaque réponse est sourcée.
      </div>
    );
  }

  return (
    <>
      <p className="chat-scope">
        <Icon name="shield" />
        Le Copilote ne répond qu&apos;à partir des {nbDocumentsIndexes} document
        {nbDocumentsIndexes > 1 ? "s" : ""} de ce dossier, lus sous l&apos;angle{" "}
        {PROFIL_LABELS_COURTS[profilActif]}.
      </p>

      <div className="qpacks">
        <span className="lb">Questions fréquentes</span>
        {PACKS[typeOperation].map((q) => (
          <button key={q} type="button" className="qpack" onClick={() => envoyer(q)} disabled={enAttente}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat">
        <div className="chat__stream" ref={flux}>
          {messages.length === 0 ? (
            <p className="muted" style={{ fontSize: 14, textAlign: "center", padding: "40px 0" }}>
              Posez votre première question, ou choisissez-en une ci-dessus.
            </p>
          ) : (
            messages.map((message) => (
              <div
                className={`msg msg--${message.role === "user" ? "user" : "ai"}`}
                key={message.id}
              >
                <span className="msg__av">
                  {message.role === "user" ? "V" : <Icon name="lens" className="lens" />}
                </span>

                <div className="msg__body">
                  {message.complexity_label === "complexe" ? (
                    <span className="deep">
                      <Icon name="lens" />
                      Analyse approfondie
                    </span>
                  ) : null}

                  {message.content.split("\n").filter(Boolean).map((paragraphe, index) => (
                    <p key={index}>{paragraphe}</p>
                  ))}

                  {message.role === "assistant" && message.sources.length > 0 ? (
                    <div className="sources">
                      <div className="lbl">Sources — la page exacte</div>
                      <div className="sources__list">
                        {message.sources.map((source, index) => (
                          <span className="src-card" key={index}>
                            <span className="pg">{source.page ? `p.${source.page}` : "—"}</span>
                            <span className="fn">{source.document}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {message.role === "assistant" ? (
                    <div className="msg-acts">
                      <button type="button" onClick={() => epingler(message)} disabled={message.epingle}>
                        <Icon name="pin" />
                        {message.epingle ? "Ajouté à la note" : "Ajouter à ma note"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(message.content)}
                      >
                        <Icon name="doc" />
                        Copier
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}

          {enAttente ? (
            <div className="msg msg--ai">
              <span className="msg__av">
                <Icon name="lens" className="lens" />
              </span>
              <div className="msg__body">
                <div className="typing" aria-label="Le Copilote rédige sa réponse">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {erreur ? (
          <p
            role="alert"
            className="badge badge--crit"
            style={{ height: "auto", padding: "10px 16px", margin: "0 17px 12px", display: "block", lineHeight: 1.5 }}
          >
            {erreur}
          </p>
        ) : null}

        <form
          className="chat__input"
          onSubmit={(e) => {
            e.preventDefault();
            envoyer(question);
          }}
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                envoyer(question);
              }
            }}
            placeholder="Posez une question sur ce dossier…"
            aria-label="Votre question"
            rows={1}
          />
          <button type="submit" className="chat__send" disabled={enAttente || !question.trim()} aria-label="Envoyer">
            <Icon name="send" />
          </button>
        </form>
      </div>
    </>
  );
}
