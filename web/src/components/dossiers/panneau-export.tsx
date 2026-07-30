"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PROFIL_LABELS } from "@/lib/offres";
import type { Enums } from "@/types/database";

const MODELES = [
  { valeur: "note_investissement", label: "Note d'investissement", detail: "Pour le comité" },
  { valeur: "screening_rapide", label: "Screening rapide", detail: "Deux pages, l'essentiel" },
  { valeur: "due_diligence", label: "Due diligence complète", detail: "Toutes les sections" },
];

export function PanneauExport({
  dossierId,
  profilActif,
  noteDisponible,
}: {
  dossierId: string;
  profilActif: Enums<"profil_analyse">;
  noteDisponible: boolean;
}) {
  const [format, setFormat] = useState<"pdf" | "word">("pdf");
  const [modele, setModele] = useState("note_investissement");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lien, setLien] = useState<string | null>(null);

  async function exporter() {
    setEnCours(true);
    setErreur(null);
    setLien(null);

    try {
      const reponse = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossier_id: dossierId, profil: profilActif, format, template: modele }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.error ?? "La génération du document a échoué.");
        return;
      }

      setLien(donnees.download_url ?? null);
    } catch {
      setErreur("Connexion interrompue. Le document n'a pas été généré.");
    } finally {
      setEnCours(false);
    }
  }

  if (!noteDisponible) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="dl" />
        </div>
        <b>Aucune note à exporter pour ce profil</b>
        Lancez l&apos;analyse du dossier depuis l&apos;onglet Synthèse : l&apos;export reprend la note du
        profil actif, avec vos ajouts épinglés.
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <h3 style={{ fontSize: 17, marginBottom: 6 }}>Exporter la note</h3>
      <p className="muted" style={{ fontSize: 13.5, marginBottom: 22 }}>
        Le document reprend la note du profil <b>{PROFIL_LABELS[profilActif]}</b>, avec les réponses du
        Copilote que vous avez épinglées, classées par catégorie.
      </p>

      <div className="field">
        <label htmlFor="modele-export">Modèle</label>
        <select
          id="modele-export"
          className="select"
          value={modele}
          onChange={(e) => setModele(e.target.value)}
        >
          {MODELES.map((m) => (
            <option key={m.valeur} value={m.valeur}>
              {m.label} — {m.detail}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Format</label>
        <div className="chips">
          <button
            type="button"
            className={`chip${format === "pdf" ? " is-active" : ""}`}
            onClick={() => setFormat("pdf")}
          >
            PDF
          </button>
          <button
            type="button"
            className={`chip${format === "word" ? " is-active" : ""}`}
            onClick={() => setFormat("word")}
          >
            Word
          </button>
        </div>
      </div>

      {erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "10px 13px", margin: "16px 0", display: "block", lineHeight: 1.5 }}
        >
          {erreur}
        </p>
      ) : null}

      {lien ? (
        <p
          className="badge badge--ok"
          style={{ height: "auto", padding: "12px 15px", margin: "16px 0", display: "block", lineHeight: 1.6 }}
        >
          Document prêt.{" "}
          <a href={lien} download style={{ textDecoration: "underline", fontWeight: 700 }}>
            Télécharger maintenant
          </a>{" "}
          — le lien reste valable 10 minutes.
        </p>
      ) : null}

      <button type="button" className="btn btn--primary" onClick={exporter} disabled={enCours}>
        <Icon name="dl" style={{ width: 15, height: 15 }} />
        {enCours ? "Génération…" : `Générer le ${format === "pdf" ? "PDF" : "Word"}`}
      </button>
    </div>
  );
}
