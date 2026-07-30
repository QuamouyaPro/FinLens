"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import type { Enums } from "@/types/database";
import type { SourceCitation } from "@/types/domain";

export type Contradiction = {
  id: string;
  gravite: Enums<"gravite">;
  description: string;
  source_a: SourceCitation;
  source_b: SourceCitation;
  status: Enums<"contradiction_status">;
};

export type ItemChecklist = {
  id: string;
  label: string;
  auto_checked: boolean;
  requires_manual_check: boolean;
};

const CLASSES_GRAVITE: Record<Enums<"gravite">, string> = {
  critique: "",
  a_verifier: " med",
  mineur: " low",
};

const LIBELLES_GRAVITE: Record<Enums<"gravite">, string> = {
  critique: "Critique",
  a_verifier: "À vérifier",
  mineur: "Mineur",
};

export function PanneauControles({
  contradictions,
  checklist,
}: {
  contradictions: Contradiction[];
  checklist: ItemChecklist[];
}) {
  const router = useRouter();
  const [enCours, setEnCours] = useState<string | null>(null);

  async function arbitrer(id: string, statusActuel: Enums<"contradiction_status">) {
    setEnCours(id);
    try {
      await fetch(`/api/contradictions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusActuel === "ouverte" ? "arbitree" : "ouverte" }),
      });
      router.refresh();
    } finally {
      setEnCours(null);
    }
  }

  async function cocher(item: ItemChecklist) {
    setEnCours(item.id);
    try {
      await fetch(`/api/checklist/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_checked: !item.auto_checked }),
      });
      router.refresh();
    } finally {
      setEnCours(null);
    }
  }

  const coches = checklist.filter((i) => i.auto_checked).length;

  return (
    <>
      <div className="block-h" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17 }}>Contradictions entre documents</h2>
      </div>

      {contradictions.length === 0 ? (
        <div className="empty" style={{ marginBottom: 30 }}>
          <div className="ic">
            <Icon name="check" />
          </div>
          <b>Aucune contradiction détectée</b>
          Le moteur a croisé les chiffres, dates et clauses de ce dossier sans relever d&apos;écart.
        </div>
      ) : (
        contradictions.map((contradiction) => (
          <div className={`contra${CLASSES_GRAVITE[contradiction.gravite]}`} key={contradiction.id}>
            <div className="contra__h">
              <span className="ic">
                <Icon name="split" />
              </span>
              <span className="tt">
                <b>{LIBELLES_GRAVITE[contradiction.gravite]}</b>
                <span>
                  {contradiction.status === "arbitree"
                    ? "Arbitré — conservé pour mémoire"
                    : "À arbitrer avant le comité"}
                </span>
              </span>
              {contradiction.status === "arbitree" ? (
                <span className="badge badge--ok">Arbitré</span>
              ) : null}
            </div>

            <div className="contra__vs">
              <div className="contra__side">
                <div className="sl">Source A</div>
                <div className="sv">{contradiction.source_a.page ? `p.${contradiction.source_a.page}` : "—"}</div>
                <div className="sq">
                  {contradiction.source_a.extrait || contradiction.source_a.document}
                </div>
              </div>
              <div className="contra__mid">vs</div>
              <div className="contra__side">
                <div className="sl">Source B</div>
                <div className="sv">{contradiction.source_b.page ? `p.${contradiction.source_b.page}` : "—"}</div>
                <div className="sq">
                  {contradiction.source_b.extrait || contradiction.source_b.document}
                </div>
              </div>
            </div>

            <p className="contra__note">{contradiction.description}</p>

            <div className="contra__acts">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => arbitrer(contradiction.id, contradiction.status)}
                disabled={enCours === contradiction.id}
              >
                <Icon name="check" style={{ width: 14, height: 14 }} />
                {contradiction.status === "ouverte" ? "Marquer comme arbitré" : "Rouvrir"}
              </button>
            </div>
          </div>
        ))
      )}

      <div className="block-h" style={{ margin: "30px 0 14px" }}>
        <h2 style={{ fontSize: 17 }}>Checklist de due diligence</h2>
        {checklist.length > 0 ? (
          <span className="muted" style={{ fontSize: 13 }}>
            {coches} / {checklist.length} traités
          </span>
        ) : null}
      </div>

      {checklist.length === 0 ? (
        <div className="empty">
          <div className="ic">
            <Icon name="list" />
          </div>
          <b>La checklist se crée avec l&apos;analyse</b>
          Elle est pré-chargée selon le type d&apos;opération du dossier dès la première analyse.
        </div>
      ) : (
        checklist.map((item) => (
          <label
            className="doc-item"
            key={item.id}
            style={{ cursor: "pointer", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={item.auto_checked}
              onChange={() => cocher(item)}
              disabled={enCours === item.id}
              style={{ width: 17, height: 17, accentColor: "var(--accent)", flex: "none" }}
            />
            <span className="info">
              <span
                className="n"
                style={{
                  textDecoration: item.auto_checked ? "line-through" : "none",
                  color: item.auto_checked ? "var(--text-faint)" : undefined,
                }}
              >
                {item.label}
              </span>
            </span>
            {item.requires_manual_check && !item.auto_checked ? (
              <span className="badge badge--warn">Vérification manuelle</span>
            ) : null}
          </label>
        ))
      )}
    </>
  );
}
