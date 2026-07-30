"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { dateRelative, initiale } from "@/lib/format";
import { TYPES_OPERATION, libelleRisque, niveauRisque } from "@/lib/offres";
import type { Enums } from "@/types/database";

export type DossierListe = {
  id: string;
  name: string;
  status: Enums<"dossier_status">;
  type_operation: Enums<"type_operation">;
  risk_score: number | null;
  updated_at: string;
  purge_at: string | null;
  nb_documents: number;
  nb_signaux: number;
};

type Filtre = "actif" | "archive" | "corbeille" | "tous";

const FILTRES: { cle: Filtre; label: string }[] = [
  { cle: "actif", label: "Actifs" },
  { cle: "archive", label: "Archivés" },
  { cle: "corbeille", label: "Corbeille" },
  { cle: "tous", label: "Tous" },
];

export function ListeDossiers({ dossiers }: { dossiers: DossierListe[] }) {
  const router = useRouter();
  const [filtre, setFiltre] = useState<Filtre>("actif");
  const [recherche, setRecherche] = useState("");
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);

  const compteurs = useMemo(() => {
    return {
      actif: dossiers.filter((d) => d.status === "actif").length,
      archive: dossiers.filter((d) => d.status === "archive").length,
      corbeille: dossiers.filter((d) => d.status === "corbeille").length,
      tous: dossiers.length,
    };
  }, [dossiers]);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return dossiers
      .filter((d) => (filtre === "tous" ? true : d.status === filtre))
      .filter((d) =>
        q ? `${d.name} ${TYPES_OPERATION[d.type_operation]}`.toLowerCase().includes(q) : true
      );
  }, [dossiers, filtre, recherche]);

  async function agir(id: string, action: "archive" | "corbeille" | "restaurer") {
    setActionEnCours(id);
    try {
      const reponse = await fetch(`/api/dossiers/${id}/${action}`, { method: "POST" });
      if (!reponse.ok) {
        const donnees = await reponse.json().catch(() => ({}));
        window.alert(donnees.error ?? "L'action a échoué.");
        return;
      }
      router.refresh();
    } finally {
      setActionEnCours(null);
    }
  }

  return (
    <>
      <div className="toolbar">
        <div className="search" style={{ cursor: "text" }}>
          <Icon name="srch" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Filtrer par nom ou secteur…"
            aria-label="Filtrer les dossiers"
          />
        </div>

        <div className="chips">
          {FILTRES.map(({ cle, label }) => (
            <button
              key={cle}
              type="button"
              className={`chip${filtre === cle ? " is-active" : ""}`}
              onClick={() => setFiltre(cle)}
            >
              {label}
              <span className="mono">{compteurs[cle]}</span>
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="empty">
          <div className="ic">
            <Icon name="folder" />
          </div>
          <b>
            {recherche
              ? "Aucun dossier ne correspond à ce filtre"
              : filtre === "corbeille"
                ? "La corbeille est vide"
                : filtre === "archive"
                  ? "Aucun dossier archivé"
                  : "Aucun dossier pour le moment"}
          </b>
          {filtre === "actif" && !recherche
            ? "Créez un dossier par entreprise étudiée, puis déposez-y les documents à analyser."
            : "Ajustez le filtre pour retrouver vos autres dossiers."}
        </div>
      ) : (
        visibles.map((dossier) => {
          const niveau = niveauRisque(dossier.risk_score);
          const enCorbeille = dossier.status === "corbeille";

          return (
            <div key={dossier.id} className={`d-row${dossier.status !== "actif" ? " is-archived" : ""}`}>
              <Link
                href={`/dossiers/${dossier.id}`}
                className="thumb"
                aria-label={`Ouvrir ${dossier.name}`}
              >
                {initiale(dossier.name)}
              </Link>

              <Link href={`/dossiers/${dossier.id}`} className="meta">
                <div className="t">
                  {dossier.name}
                  {dossier.nb_signaux > 0 ? (
                    <span className="badge badge--crit">
                      <Icon name="alert" style={{ width: 11, height: 11 }} />
                      {dossier.nb_signaux}
                    </span>
                  ) : null}
                  {dossier.status === "archive" ? <span className="badge badge--muted">Archivé</span> : null}
                </div>
                <div className="s">
                  <span>
                    <Icon name="doc" />
                    {dossier.nb_documents} document{dossier.nb_documents > 1 ? "s" : ""}
                  </span>
                  <span>{TYPES_OPERATION[dossier.type_operation]}</span>
                  {enCorbeille && dossier.purge_at ? (
                    <span style={{ color: "var(--danger)" }}>
                      Purge le {new Date(dossier.purge_at).toLocaleDateString("fr-FR")}
                    </span>
                  ) : null}
                </div>
              </Link>

              {dossier.risk_score !== null ? (
                <span className={`risk risk-${niveau}`} title={libelleRisque(dossier.risk_score)}>
                  {dossier.risk_score}
                </span>
              ) : (
                <span className="badge badge--muted">Non analysé</span>
              )}

              <span className="when">{dateRelative(dossier.updated_at)}</span>

              <div className="acts">
                {dossier.status === "actif" ? (
                  <button
                    type="button"
                    className="iconbtn"
                    onClick={() => agir(dossier.id, "archive")}
                    disabled={actionEnCours === dossier.id}
                    aria-label={`Archiver ${dossier.name}`}
                    title="Archiver — libère un emplacement, ne supprime rien"
                  >
                    <Icon name="arch" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="iconbtn"
                    onClick={() => agir(dossier.id, "restaurer")}
                    disabled={actionEnCours === dossier.id}
                    aria-label={`Restaurer ${dossier.name}`}
                    title="Restaurer"
                  >
                    <Icon name="restore" />
                  </button>
                )}

                {!enCorbeille ? (
                  <button
                    type="button"
                    className="iconbtn"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Mettre « ${dossier.name} » à la corbeille ? Le dossier reste restaurable pendant 30 jours, puis sera définitivement purgé.`
                        )
                      ) {
                        agir(dossier.id, "corbeille");
                      }
                    }}
                    disabled={actionEnCours === dossier.id}
                    aria-label={`Mettre ${dossier.name} à la corbeille`}
                    title="Mettre à la corbeille (30 jours de grâce)"
                  >
                    <Icon name="trash" />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
