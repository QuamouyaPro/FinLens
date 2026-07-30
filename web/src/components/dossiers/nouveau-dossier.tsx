"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { TYPES_OPERATION } from "@/lib/offres";
import type { Enums } from "@/types/database";

type TypeOperation = Enums<"type_operation">;

/**
 * Création d'un dossier. Le type d'opération détermine la checklist de due
 * diligence pré-chargée et les questions suggérées du Copilote — c'est pour ça
 * qu'il est demandé dès la création plutôt que plus tard.
 */
export function NouveauDossier({ plafondAtteint, plafond }: { plafondAtteint: boolean; plafond: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?nouveau=1 ouvre la fenêtre depuis la palette ⌘K ou l'appbar : l'URL est la
  // source de vérité, complétée par l'état local une fois la page chargée.
  const demandeParUrl = searchParams.get("nouveau") === "1";
  const [ouvertManuel, setOuvertManuel] = useState(false);
  const [fermeApresUrl, setFermeApresUrl] = useState(false);
  const ouvert = ouvertManuel || (demandeParUrl && !fermeApresUrl);

  const [nom, setNom] = useState("");
  const [type, setType] = useState<TypeOperation>("screening");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  function setOuvert(valeur: boolean) {
    setOuvertManuel(valeur);
    setFermeApresUrl(!valeur);
  }

  function fermer() {
    setOuvert(false);
    setErreur(null);
    if (demandeParUrl) router.replace("/dossiers");
  }

  async function creer(event: React.FormEvent) {
    event.preventDefault();
    setEnCours(true);
    setErreur(null);

    try {
      const reponse = await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nom.trim(), type_operation: type }),
      });
      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.error ?? "La création du dossier a échoué.");
        return;
      }

      setOuvert(false);
      setNom("");
      router.push(`/dossiers/${donnees.dossier.id}`);
    } catch {
      setErreur("Connexion interrompue. Vérifiez votre réseau et réessayez.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn--primary"
        onClick={() => setOuvert(true)}
        disabled={plafondAtteint}
        title={plafondAtteint ? `Plafond de ${plafond} dossiers ouverts atteint` : undefined}
      >
        <Icon name="plus" style={{ width: 16, height: 16 }} />
        Nouveau dossier
      </button>

      {ouvert ? (
        <div
          className="modal-bg is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Créer un dossier"
          onClick={(e) => {
            if (e.target === e.currentTarget) fermer();
          }}
        >
          <form className="modal" onSubmit={creer}>
            <div className="modal__h">
              <h3>Nouveau dossier</h3>
              <p>
                Un dossier correspond à une entreprise étudiée. Le type d&apos;opération pré-charge la
                checklist de due diligence et les questions du Copilote.
              </p>
            </div>

            <div className="modal__b">
              {erreur ? (
                <p
                  role="alert"
                  className="badge badge--crit"
                  style={{ height: "auto", padding: "10px 13px", marginBottom: 16, display: "block", lineHeight: 1.5 }}
                >
                  {erreur}
                </p>
              ) : null}

              <div className="field">
                <label htmlFor="nom-dossier">Entreprise étudiée</label>
                <input
                  id="nom-dossier"
                  className="input"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="LVMH — Rapport annuel 2024"
                  required
                  maxLength={200}
                  autoFocus
                />
              </div>

              <div className="field">
                <label htmlFor="type-operation">Type d&apos;opération</label>
                <select
                  id="type-operation"
                  className="select"
                  value={type}
                  onChange={(e) => setType(e.target.value as TypeOperation)}
                >
                  {Object.entries(TYPES_OPERATION).map(([valeur, label]) => (
                    <option key={valeur} value={valeur}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal__f">
              <button type="button" className="btn btn--ghost" onClick={fermer}>
                Annuler
              </button>
              <button type="submit" className="btn btn--primary" disabled={enCours || !nom.trim()}>
                {enCours ? "Création…" : "Créer le dossier"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
