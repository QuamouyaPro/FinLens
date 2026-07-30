"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { dateRelative } from "@/lib/format";
import type { Enums } from "@/types/database";

export type DocumentListe = {
  id: string;
  original_name: string;
  mime_type: string | null;
  page_count: number | null;
  status: Enums<"document_status">;
  is_duplicate_of: string | null;
  error_message: string | null;
  created_at: string;
};

const LIBELLES_STATUT: Record<Enums<"document_status">, { texte: string; classe: string }> = {
  en_attente: { texte: "À indexer", classe: "badge--muted" },
  en_cours: { texte: "Indexation…", classe: "badge--info" },
  indexe: { texte: "Indexé", classe: "badge--ok" },
  erreur: { texte: "Échec", classe: "badge--crit" },
};

function extension(nom: string) {
  return nom.split(".").pop()?.toUpperCase().slice(0, 4) ?? "?";
}

const MAX_DOCUMENTS = 50;

export function PanneauDocuments({
  dossierId,
  documents,
}: {
  dossierId: string;
  documents: DocumentListe[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enversoi, setEnvoi] = useState(false);
  const [progression, setProgression] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const plafondAtteint = documents.length >= MAX_DOCUMENTS;

  async function envoyer(fichiers: FileList | null) {
    if (!fichiers?.length) return;

    setEnvoi(true);
    setErreur(null);

    try {
      for (let i = 0; i < fichiers.length; i++) {
        const fichier = fichiers[i];
        setProgression(`Dépôt de ${fichier.name} (${i + 1}/${fichiers.length})…`);

        const formData = new FormData();
        formData.append("dossier_id", dossierId);
        formData.append("file", fichier);

        const reponseUpload = await fetch("/api/documents/upload", { method: "POST", body: formData });
        const donneesUpload = await reponseUpload.json();

        if (!reponseUpload.ok) {
          setErreur(donneesUpload.error ?? `Le dépôt de ${fichier.name} a échoué.`);
          break;
        }

        // L'indexation (extraction du texte + vectorisation) suit immédiatement :
        // c'est elle qui rend le document interrogeable par le Copilote.
        setProgression(`Indexation de ${fichier.name}…`);
        const reponseIndex = await fetch(`/api/documents/${donneesUpload.document.id}/indexer`, {
          method: "POST",
        });

        if (!reponseIndex.ok) {
          const donneesIndex = await reponseIndex.json().catch(() => ({}));
          setErreur(
            donneesIndex.error ??
              `${fichier.name} a été déposé mais son indexation a échoué. Réessayez depuis la liste.`
          );
        }
      }

      router.refresh();
    } catch {
      setErreur("Connexion interrompue pendant l'envoi. Vérifiez votre réseau et réessayez.");
    } finally {
      setEnvoi(false);
      setProgression(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function reindexer(documentId: string) {
    setEnvoi(true);
    try {
      const reponse = await fetch(`/api/documents/${documentId}/indexer`, { method: "POST" });
      if (!reponse.ok) {
        const donnees = await reponse.json().catch(() => ({}));
        setErreur(donnees.error ?? "L'indexation a échoué.");
      }
      router.refresh();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <>
      <div
        className="dropzone"
        onClick={() => !plafondAtteint && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!plafondAtteint) envoyer(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <div className="ic">
          <Icon name="dl" />
        </div>
        <h3>{plafondAtteint ? "Plafond de 50 documents atteint" : "Déposez vos documents"}</h3>
        <p>
          {plafondAtteint
            ? "Créez un second dossier pour poursuivre l'analyse."
            : "PDF pour l'instant — glissez plusieurs fichiers à la fois. Le volume de pages n'est pas limité."}
        </p>
        {!plafondAtteint ? (
          <span className="btn btn--subtle btn--sm">
            <Icon name="plus" style={{ width: 14, height: 14 }} />
            Choisir des fichiers
          </span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => envoyer(e.target.files)}
        />
      </div>

      {progression ? (
        <p className="badge badge--info" style={{ height: "auto", padding: "10px 13px", marginBottom: 16, display: "block" }}>
          {progression}
        </p>
      ) : null}

      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "10px 13px", marginBottom: 16, display: "block", lineHeight: 1.5 }}
        >
          {erreur}
        </p>
      ) : null}

      {documents.length === 0 ? (
        <div className="empty">
          <div className="ic">
            <Icon name="doc" />
          </div>
          <b>Aucun document dans ce dossier</b>
          Déposez un rapport annuel, une due diligence ou un bilan pour lancer l&apos;analyse.
        </div>
      ) : (
        <>
          <div className="block-h" style={{ marginBottom: 13 }}>
            <h2 style={{ fontSize: 15 }}>
              {documents.length} document{documents.length > 1 ? "s" : ""} · {MAX_DOCUMENTS - documents.length} emplacement
              {MAX_DOCUMENTS - documents.length > 1 ? "s" : ""} restant
              {MAX_DOCUMENTS - documents.length > 1 ? "s" : ""}
            </h2>
          </div>

          {documents.map((doc) => {
            const statut = LIBELLES_STATUT[doc.status];
            return (
              <div className="doc-item" key={doc.id}>
                <span className="ft" style={{ background: "var(--accent-wash)", color: "var(--accent)" }}>
                  {extension(doc.original_name)}
                </span>

                <span className="info">
                  <span className="n">{doc.original_name}</span>
                  <span className="x">
                    {doc.page_count ? `${doc.page_count} pages · ` : ""}
                    déposé {dateRelative(doc.created_at)}
                    {doc.is_duplicate_of ? " · doublon détecté, exclu de l'analyse" : ""}
                    {doc.error_message ? ` · ${doc.error_message}` : ""}
                  </span>
                </span>

                <span className={`badge ${statut.classe}`}>{statut.texte}</span>

                {doc.status !== "indexe" && doc.status !== "en_cours" ? (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => reindexer(doc.id)}
                    disabled={enversoi}
                  >
                    Indexer
                  </button>
                ) : null}
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
