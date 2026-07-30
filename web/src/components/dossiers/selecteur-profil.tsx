"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import {
  PROFILS_ORDRE,
  PROFIL_ANGLES,
  PROFIL_LABELS_COURTS,
  profilDisponible,
} from "@/lib/offres";
import type { Enums } from "@/types/database";

type ProfilAnalyse = Enums<"profil_analyse">;

const ICONES: Record<ProfilAnalyse, IconName> = {
  pe_vc: "rocket",
  ma: "scale",
  family_office: "bank",
  cfo: "tbl",
  audit_conseil: "shield",
  generaliste: "star",
  personnalise: "sliders",
};

type Props = {
  dossierId: string;
  profilActif: ProfilAnalyse;
  offre: Enums<"offre">;
  profilsGeneres: ProfilAnalyse[];
};

/**
 * Bascule entre profils d'analyse. Les profils déjà générés sont lus directement
 * en base — instantané, aucun appel IA (Note d'Architecture, 4.I.1). Les profils
 * réservés affichent un cadenas et invitent à changer d'offre plutôt que de
 * basculer silencieusement.
 */
export function SelecteurProfil({ dossierId, profilActif, offre, profilsGeneres }: Props) {
  const router = useRouter();
  const [enTransition, demarrerTransition] = useTransition();
  const [messageVerrou, setMessageVerrou] = useState<string | null>(null);
  const [generationEnCours, setGenerationEnCours] = useState(false);

  async function choisir(profil: ProfilAnalyse) {
    if (!profilDisponible(offre, profil)) {
      setMessageVerrou(
        `Le profil ${PROFIL_LABELS_COURTS[profil]} est réservé aux offres Analyste et Fonds.`
      );
      return;
    }

    setMessageVerrou(null);

    // Le profil Personnalisé se génère à la demande (l'utilisateur choisit
    // d'abord ses indicateurs) ; les six profils métier sont pré-générés.
    if (!profilsGeneres.includes(profil)) {
      setGenerationEnCours(true);
      try {
        const reponse = await fetch(`/api/dossiers/${dossierId}/profils/${profil}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!reponse.ok) {
          const donnees = await reponse.json().catch(() => ({}));
          setMessageVerrou(donnees.error ?? "La génération de cette note a échoué.");
          return;
        }
      } finally {
        setGenerationEnCours(false);
      }
    }

    await fetch(`/api/dossiers/${dossierId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active_profil: profil }),
    });

    demarrerTransition(() => router.refresh());
  }

  return (
    <div className="profbar">
      <div className="profbar__h">
        <div className="lt">
          <Icon name="sliders" />
          <b>Profil d&apos;analyse</b>
          <span>
            {offre === "essentiel"
              ? "3 profils sur 6 — les autres sont réservés aux offres pro"
              : "Les mêmes documents, lus sous l'angle de votre métier"}
          </span>
        </div>
        {enTransition || generationEnCours ? (
          <span className="badge badge--ok">
            {generationEnCours ? "Génération de la note…" : "Mise à jour…"}
          </span>
        ) : null}
      </div>

      <div className="profs">
        {PROFILS_ORDRE.map((profil) => {
          const disponible = profilDisponible(offre, profil);
          const actif = profil === profilActif;

          return (
            <button
              key={profil}
              type="button"
              className={`prof${actif ? " is-active" : ""}${disponible ? "" : " is-locked"}`}
              onClick={() => choisir(profil)}
              aria-current={actif ? "true" : undefined}
            >
              <span className="pi">
                <Icon name={ICONES[profil]} />
              </span>
              <span className="pn">{PROFIL_LABELS_COURTS[profil]}</span>
              <span className="pd">{PROFIL_ANGLES[profil]}</span>
              {!disponible ? (
                <span className="plk">
                  <Icon name="lock" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {messageVerrou ? (
        <p
          role="alert"
          className="badge badge--warn"
          style={{ height: "auto", padding: "10px 13px", marginTop: 14, display: "block", lineHeight: 1.5 }}
        >
          {messageVerrou}
        </p>
      ) : null}
    </div>
  );
}
