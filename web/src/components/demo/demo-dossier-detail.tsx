"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { JaugeRisque } from "@/components/dossiers/jauge-risque";
import { OngletsDossier } from "@/components/dossiers/onglets-dossier";
import { ResumeProfil } from "./resume-profil";
import { NoteComplete } from "./note-complete";
import { ChiffresCles } from "./chiffres-cles";
import { CarteSource } from "./rendu";
import {
  PROFILS,
  KPI_LIB,
  ETATS_FINANCIERS,
  CONTRADICTIONS,
  CHECKLISTS,
  QPACKS,
  DOCUMENTS_MANQUANTS,
} from "@/lib/demo";
import { ORDRE_PROFILS, type CleProfilPrototype, type DossierPrototype } from "@/lib/demo/types";
import { CHAT_DEMO } from "@/lib/demo/chat";

const ICONES_PROFIL: Record<CleProfilPrototype, IconName> = {
  pevc: "rocket", ma: "scale", family: "bank", cfo: "tbl",
  audit: "shield", general: "star", custom: "sliders",
};

function PanneauDocuments({ dossier }: { dossier: DossierPrototype }) {
  const manquants = DOCUMENTS_MANQUANTS[dossier.id] ?? [];

  return (
    <>
      <div className="note-banner">
        <Icon name="lens" />
        <span>
          {dossier.docs} documents indexés · complétude {dossier.compl} %. En démonstration, le dépôt
          de fichiers est désactivé : c&apos;est la seule chose qui change par rapport à un vrai
          espace.
        </span>
      </div>

      {manquants.length ? (
        <>
          <div className="block-h" style={{ margin: "24px 0 13px" }}>
            <h2 style={{ fontSize: 16 }}>Documents attendus mais absents</h2>
          </div>
          {manquants.map(([nom, raison]) => (
            <div className="doc-item" key={nom}>
              <span className="ft" style={{ background: "var(--signal-tint)", color: "var(--signal)" }}>
                ?
              </span>
              <span className="info">
                <span className="n">{nom}</span>
                <span className="x">{raison}</span>
              </span>
              <span className="badge badge--warn">Manquant</span>
            </div>
          ))}
        </>
      ) : (
        <div className="empty">
          <div className="ic">
            <Icon name="check" />
          </div>
          <b>Dossier complet</b>
          Aucun document attendu ne manque pour le type d&apos;opération déclaré.
        </div>
      )}
    </>
  );
}

function Copilote({ dossierId, typeOperation }: { dossierId: string; typeOperation: string }) {
  const questions = CHAT_DEMO[dossierId] ?? [];
  const suggestions = QPACKS[typeOperation] ?? [];
  const [actif, setActif] = useState(0);

  if (!questions.length) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="chat" />
        </div>
        <b>Copilote non préconstruit pour ce dossier</b>
        Ouvrez LVMH ou Projet Helios pour tester des réponses sourcées à la page.
      </div>
    );
  }

  const question = questions[actif];

  return (
    <>
      <p className="chat-scope">
        <Icon name="shield" />
        Démonstration : ces réponses sont préconstruites. Dans un vrai espace, le Copilote lit vos
        propres documents et cite leur page exacte.
      </p>

      <div className="qpacks">
        <span className="lb">Questions du pack {typeOperation}</span>
        {questions.map((q, i) => (
          <button
            key={q.question}
            type="button"
            className={`qpack${i === actif ? " is-active" : ""}`}
            onClick={() => setActif(i)}
          >
            {q.question}
          </button>
        ))}
      </div>

      <div className="chat">
        <div className="chat__stream">
          <div className="msg msg--user">
            <span className="msg__av">V</span>
            <div className="msg__body">{question.question}</div>
          </div>
          <div className="msg msg--ai">
            <span className="msg__av">
              <Icon name="lens" className="lens" />
            </span>
            <div className="msg__body">
              <p>{question.reponse}</p>
              {question.sources.length ? (
                <div className="sources">
                  <div className="lbl">Sources — la page exacte</div>
                  <div className="sources__list">
                    {question.sources.map((s, i) => (
                      <span className="src-card" key={i}>
                        <span className="pg">{s.page ? `p.${s.page}` : "—"}</span>
                        <span className="fn">{s.document}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="chat__suggest">
          {suggestions.slice(0, 3).map((s) => (
            <span className="sugg" key={s} style={{ opacity: 0.55 }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Controles({ dossierId }: { dossierId: string }) {
  const contradictions = CONTRADICTIONS[dossierId] ?? [];
  const groupes = CHECKLISTS[dossierId] ?? [];
  const tousItems = groupes.flatMap((g) => g.items);

  const [coches, setCoches] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tousItems.map((i) => [i.t, i.done]))
  );

  const CLASSES = { high: "", med: " med", low: " low" } as const;
  const LABELS = { high: "Critique", med: "À vérifier", low: "Mineur" } as const;

  if (!contradictions.length && !groupes.length) {
    return (
      <div className="empty">
        <div className="ic">
          <Icon name="check" />
        </div>
        <b>Contrôles non préconstruits pour ce dossier</b>
        Ouvrez Projet Helios pour voir des contradictions détectées entre documents.
      </div>
    );
  }

  return (
    <>
      {contradictions.length ? (
        <>
          <div className="block-h" style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 17 }}>Contradictions entre documents</h2>
          </div>

          {contradictions.map((c) => (
            <div className={`contra${CLASSES[c.lvl]}`} key={c.title}>
              <div className="contra__h">
                <span className="ic">
                  <Icon name="split" />
                </span>
                <span className="tt">
                  <b>{c.title}</b>
                  <span>{c.cat}</span>
                </span>
                <span className={`badge badge--${c.lvl === "high" ? "crit" : c.lvl === "med" ? "warn" : "info"}`}>
                  {LABELS[c.lvl]}
                </span>
              </div>

              <div className="contra__vs">
                <div className="contra__side">
                  <div className="sl">{c.a.lbl}</div>
                  <div className="sv">{c.a.v}</div>
                  <div className="sq">{c.a.q}</div>
                </div>
                <div className="contra__mid">vs</div>
                <div className="contra__side">
                  <div className="sl">{c.b.lbl}</div>
                  <div className="sv">{c.b.v}</div>
                  <div className="sq">{c.b.q}</div>
                </div>
              </div>

              <p className="contra__note">{c.note}</p>

              <div className="contra__acts">
                <CarteSource cle={c.a.k} />
                <CarteSource cle={c.b.k} />
              </div>
            </div>
          ))}
        </>
      ) : null}

      {groupes.map((groupe) => (
        <div key={groupe.g}>
          <div className="block-h" style={{ margin: "30px 0 14px" }}>
            <h2 style={{ fontSize: 16 }}>{groupe.g}</h2>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {groupe.items.filter((i) => coches[i.t]).length} / {groupe.items.length}
            </span>
          </div>

          {groupe.items.map((item) => (
            <label className="doc-item" key={item.t} style={{ cursor: "pointer", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={coches[item.t] ?? false}
                onChange={() => setCoches((c) => ({ ...c, [item.t]: !c[item.t] }))}
                style={{ width: 17, height: 17, accentColor: "var(--accent)", flex: "none" }}
              />
              <span className="info">
                <span
                  className="n"
                  style={{
                    textDecoration: coches[item.t] ? "line-through" : "none",
                    color: coches[item.t] ? "var(--text-faint)" : undefined,
                  }}
                >
                  {item.t}
                </span>
              </span>
              {item.flag === "contra" ? <span className="badge badge--crit">Contradiction</span> : null}
              {item.flag === "missing" ? <span className="badge badge--warn">Document manquant</span> : null}
              {!item.auto && !item.flag ? <span className="badge badge--muted">Manuel</span> : null}
            </label>
          ))}
        </div>
      ))}
    </>
  );
}

function Export() {
  return (
    <div className="empty">
      <div className="ic">
        <Icon name="dl" />
      </div>
      <b>L&apos;export génère un vrai fichier — réservé aux comptes</b>
      <span style={{ display: "block", marginBottom: 18 }}>
        La note part en PDF ou Word, au format de votre fonds, avec les sources conservées en annexe
        cliquable et vos ajouts épinglés depuis le Copilote.
      </span>
      <Link href="/inscription" className="btn btn--primary">
        Créer mon espace
      </Link>
    </div>
  );
}

export function DemoDossierDetail({ dossier }: { dossier: DossierPrototype }) {
  const detaille = Boolean(PROFILS.pevc && (dossier.id === "lvmh" || dossier.id === "helios"));
  const [profilActif, setProfilActif] = useState<CleProfilPrototype>("pevc");
  const [noteOuverte, setNoteOuverte] = useState(false);

  const profil = PROFILS[profilActif];
  const etats = ETATS_FINANCIERS[dossier.id] ?? null;
  const contradictionsOuvertes = (CONTRADICTIONS[dossier.id] ?? []).filter((c) => c.lvl === "high").length;
  const kpis = detaille ? profil.kpiOrder.map((k) => KPI_LIB[k]).filter(Boolean) : [];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="crumb" style={{ marginBottom: 8 }}>
            <Link href="/demo/dossiers">Dossiers</Link>
            <Icon name="split" style={{ transform: "rotate(90deg)" }} />
            <b>{dossier.name}</b>
          </div>
          <h1>{dossier.name}</h1>
          <p>
            {dossier.type} · {dossier.sector} · {dossier.docs} documents indexés
          </p>
        </div>
      </div>

      {detaille ? (
        <div className="profbar">
          <div className="profbar__h">
            <div className="lt">
              <Icon name="sliders" />
              <b>Profil d&apos;analyse</b>
              <span>Les mêmes documents, lus sous l&apos;angle de votre métier</span>
            </div>
            <span className="badge badge--ink">{profil.short}</span>
          </div>
          <div className="profs">
            {ORDRE_PROFILS.map((cle) => {
              const p = PROFILS[cle];
              if (!p) return null;
              return (
                <button
                  key={cle}
                  type="button"
                  className={`prof${cle === profilActif ? " is-active" : ""}`}
                  onClick={() => setProfilActif(cle)}
                >
                  <span className="pi">
                    <Icon name={ICONES_PROFIL[cle]} />
                  </span>
                  <span className="pn">{p.short}</span>
                  <span className="pd">{p.tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <OngletsDossier
        onglets={[
          {
            cle: "synthese",
            label: "Synthèse",
            icon: "list",
            contenu: detaille ? (
              <>
                <JaugeRisque
                  score={profil.score}
                  axes={profil.axes.map(([axe, poids]) => ({ axe, poids }))}
                  resume={profil.lens ?? profil.tag}
                />

                <div className="block-h" style={{ margin: "26px 0 14px" }}>
                  <h2>Résumé exhaustif</h2>
                  <button type="button" onClick={() => setNoteOuverte(true)}>
                    Ouvrir la note complète ({profil.note.length} sections) →
                  </button>
                </div>

                <ResumeProfil sections={profil.sections} kpis={kpis} />

                <p className="engine-note">
                  <Icon name="lens" />
                  <span>
                    Extraction du dossier par <b>Claude Fable 5</b>, reformulée pour ce profil par{" "}
                    <b>Claude Sonnet 5</b> — contenu de démonstration, aucun appel réel effectué.
                  </span>
                </p>
              </>
            ) : (
              <div className="empty">
                <div className="ic">
                  <Icon name="doc" />
                </div>
                <b>Ce dossier n&apos;est pas détaillé dans la démonstration</b>
                Ouvrez <Link href="/demo/dossiers/lvmh" style={{ color: "var(--accent)", fontWeight: 600 }}>LVMH</Link>{" "}
                ou{" "}
                <Link href="/demo/dossiers/helios" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Projet Helios
                </Link>{" "}
                pour explorer une analyse complète.
              </div>
            ),
          },
          {
            cle: "chiffres",
            label: "Chiffres clés",
            icon: "tbl",
            contenu: <ChiffresCles etats={etats} />,
          },
          {
            cle: "documents",
            label: "Documents",
            icon: "folder",
            compteur: dossier.docs,
            contenu: <PanneauDocuments dossier={dossier} />,
          },
          {
            cle: "copilote",
            label: "Copilote",
            icon: "chat",
            contenu: <Copilote dossierId={dossier.id} typeOperation={dossier.type} />,
          },
          {
            cle: "controles",
            label: "Contrôles",
            icon: "split",
            alerte: contradictionsOuvertes > 0,
            contenu: <Controles dossierId={dossier.id} />,
          },
          { cle: "export", label: "Export", icon: "dl", contenu: <Export /> },
        ]}
      />

      {noteOuverte && detaille ? (
        <NoteComplete profil={profil} nomDossier={dossier.name} onFermer={() => setNoteOuverte(false)} />
      ) : null}
    </>
  );
}
