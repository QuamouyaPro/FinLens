"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { JaugeRisque } from "@/components/dossiers/jauge-risque";
import { OngletsDossier } from "@/components/dossiers/onglets-dossier";
import { PROFILS_ORDRE, PROFIL_ANGLES, PROFIL_LABELS_COURTS } from "@/lib/offres";
import type { Enums } from "@/types/database";
import type {
  DemoChecklistItem,
  DemoContradiction,
  DemoDossierMeta,
  DemoProfilNote,
  DemoQuestion,
  DemoSource,
} from "@/lib/demo/fixtures";

type ProfilAnalyse = Enums<"profil_analyse">;

const ICONES_PROFIL: Record<ProfilAnalyse, IconName> = {
  pe_vc: "rocket", ma: "scale", family_office: "bank", cfo: "tbl",
  audit_conseil: "shield", generaliste: "star", personnalise: "sliders",
};

function Citation({ source }: { source: DemoSource }) {
  return (
    <span className="cite" title={source.page ? `${source.document} — page ${source.page}` : source.document}>
      <Icon name="lens" />
      {source.page ? `p.${source.page}` : source.document}
    </span>
  );
}

function SourcesFixture({ sources }: { sources: DemoSource[] }) {
  if (!sources.length) return null;
  return (
    <div className="sources">
      <div className="lbl">Sources</div>
      <div className="sources__list">
        {sources.map((s, i) => (
          <span className="src-card" key={i}>
            <span className="pg">{s.page ? `p.${s.page}` : "—"}</span>
            <span className="fn">{s.document}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PanneauSyntheseDemo({ note }: { note: DemoProfilNote }) {
  const [complet, setComplet] = useState(false);

  return (
    <>
      <JaugeRisque score={note.score} axes={note.axes} resume={note.resume} />

      <div className="kpimini-head">
        <h3>Indicateurs clés</h3>
        <span>Sélectionnés pour ce profil — chaque valeur reste reliée à sa page source</span>
      </div>
      <div className="kpimini-grid">
        {note.indicateurs.map((indicateur, i) => (
          <div className="kpimini" key={i}>
            <div className="l">{indicateur.libelle}</div>
            <div className="v">
              {indicateur.valeur}
              {indicateur.source ? <Citation source={indicateur.source} /> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="block-h" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17 }}>Note d&apos;analyse</h2>
        <button type="button" onClick={() => setComplet((o) => !o)}>
          {complet ? "Replier la note" : "Déplier la note complète"}
        </button>
      </div>

      {(complet ? note.sections : note.sections.slice(0, 1)).map((section) => (
        <div className="summary-sec" key={section.titre}>
          <div className="sh">
            <span className="ic g">
              <Icon name="list" />
            </span>
            <h3>{section.titre}</h3>
          </div>
          <ul>
            {section.contenu.map((ligne, i) => (
              <li key={i}>{ligne}</li>
            ))}
          </ul>
        </div>
      ))}

      <p className="engine-note">
        <Icon name="lens" />
        <span>
          Extraction par <b>Claude Fable 5</b>, reformulée pour ce profil par <b>Claude Sonnet 5</b> —
          contenu fictif de démonstration, aucun appel réel n&apos;a été effectué.
        </span>
      </p>
    </>
  );
}

function CopiloteDemo({ questions }: { questions: DemoQuestion[] }) {
  const [actif, setActif] = useState(0);
  const [saisie, setSaisie] = useState("");

  const question = questions[actif];

  return (
    <>
      <p className="chat-scope">
        <Icon name="shield" />
        Démonstration : ces réponses sont préconstruites. Dans l&apos;application réelle, le Copilote lit
        vos propres documents et cite leur page exacte.
      </p>

      <div className="qpacks">
        <span className="lb">Questions suggérées</span>
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
              <SourcesFixture sources={question.sources} />
            </div>
          </div>
        </div>

        <form
          className="chat__input"
          onSubmit={(e) => {
            e.preventDefault();
            setSaisie("");
          }}
        >
          <textarea
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="En démonstration, choisissez une question suggérée ci-dessus…"
            rows={1}
          />
          <button type="submit" className="chat__send" aria-label="Envoyer" disabled>
            <Icon name="send" />
          </button>
        </form>
      </div>
    </>
  );
}

function PanneauControlesDemo({
  contradictions,
  checklist,
}: {
  contradictions: DemoContradiction[];
  checklist: DemoChecklistItem[];
}) {
  const [coches, setCoches] = useState<Record<string, boolean>>(
    () => Object.fromEntries(checklist.map((i) => [i.id, i.coche]))
  );

  const CLASSES = { critique: "", a_verifier: " med", mineur: " low" } as const;
  const LABELS = { critique: "Critique", a_verifier: "À vérifier", mineur: "Mineur" } as const;
  const total = checklist.length;
  const total_coches = Object.values(coches).filter(Boolean).length;

  return (
    <>
      <div className="block-h" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17 }}>Contradictions entre documents</h2>
      </div>

      {contradictions.map((c) => (
        <div className={`contra${CLASSES[c.gravite]}`} key={c.id}>
          <div className="contra__h">
            <span className="ic">
              <Icon name="split" />
            </span>
            <span className="tt">
              <b>{LABELS[c.gravite]}</b>
              <span>{c.titre} — {c.categorie}</span>
            </span>
          </div>
          <div className="contra__vs">
            <div className="contra__side">
              <div className="sl">Source A</div>
              <div className="sv">{c.sourceA.valeur}</div>
              <div className="sq">{c.sourceA.extrait}</div>
            </div>
            <div className="contra__mid">vs</div>
            <div className="contra__side">
              <div className="sl">Source B</div>
              <div className="sv">{c.sourceB.valeur}</div>
              <div className="sq">{c.sourceB.extrait}</div>
            </div>
          </div>
          <p className="contra__note">{c.note}</p>
        </div>
      ))}

      <div className="block-h" style={{ margin: "30px 0 14px" }}>
        <h2 style={{ fontSize: 17 }}>Checklist de due diligence</h2>
        <span className="muted" style={{ fontSize: 13 }}>
          {total_coches} / {total} traités
        </span>
      </div>

      {checklist.map((item) => (
        <label className="doc-item" key={item.id} style={{ cursor: "pointer", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={coches[item.id]}
            onChange={() => setCoches((c) => ({ ...c, [item.id]: !c[item.id] }))}
            style={{ width: 17, height: 17, accentColor: "var(--accent)", flex: "none" }}
          />
          <span className="info">
            <span
              className="n"
              style={{
                textDecoration: coches[item.id] ? "line-through" : "none",
                color: coches[item.id] ? "var(--text-faint)" : undefined,
              }}
            >
              {item.label}
            </span>
          </span>
          {item.manuel && !coches[item.id] ? <span className="badge badge--warn">Vérification manuelle</span> : null}
        </label>
      ))}
    </>
  );
}

function PanneauDocumentsDemo({ nb }: { nb: number }) {
  return (
    <div className="empty">
      <div className="ic">
        <Icon name="doc" />
      </div>
      <b>{nb} documents indexés (démonstration)</b>
      Dans l&apos;application réelle, cet onglet liste vos fichiers déposés avec leur statut
      d&apos;indexation. Créez un compte pour déposer vos propres documents.
    </div>
  );
}

function PanneauExportDemo() {
  return (
    <div className="empty">
      <div className="ic">
        <Icon name="dl" />
      </div>
      <b>Export réservé aux comptes réels</b>
      <span style={{ display: "block", marginBottom: 18 }}>
        La génération de note PDF ou Word s&apos;appuie sur vos vraies analyses — indisponible en mode
        démonstration.
      </span>
      <Link href="/inscription" className="btn btn--primary">
        Créer mon vrai espace
      </Link>
    </div>
  );
}

export function DemoDossierDetail({
  dossier,
  profils,
  contradictions,
  checklist,
  chat,
}: {
  dossier: DemoDossierMeta;
  profils: Partial<Record<ProfilAnalyse, DemoProfilNote>>;
  contradictions: DemoContradiction[];
  checklist: DemoChecklistItem[];
  chat: DemoQuestion[];
}) {
  const profilsDisponibles = PROFILS_ORDRE.filter((p) => profils[p]);
  const [profilActif, setProfilActif] = useState<ProfilAnalyse>(profilsDisponibles[0] ?? "generaliste");

  const note = profils[profilActif];

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
            {dossier.sector} · {dossier.nb_documents} documents indexés
          </p>
        </div>
      </div>

      <div className="profbar">
        <div className="profbar__h">
          <div className="lt">
            <Icon name="sliders" />
            <b>Profil d&apos;analyse</b>
            <span>Les mêmes documents, lus sous l&apos;angle de votre métier</span>
          </div>
        </div>
        <div className="profs">
          {PROFILS_ORDRE.map((profil) => {
            const disponible = Boolean(profils[profil]);
            return (
              <button
                key={profil}
                type="button"
                className={`prof${profil === profilActif ? " is-active" : ""}${disponible ? "" : " is-locked"}`}
                onClick={() => disponible && setProfilActif(profil)}
              >
                <span className="pi">
                  <Icon name={ICONES_PROFIL[profil]} />
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
      </div>

      <OngletsDossier
        onglets={[
          {
            cle: "synthese", label: "Synthèse", icon: "list",
            contenu: note ? <PanneauSyntheseDemo note={note} /> : (
              <div className="empty">
                <div className="ic"><Icon name="doc" /></div>
                <b>Ce dossier de démonstration n&apos;a pas été détaillé</b>
                Ouvrez LVMH ou Projet Helios pour explorer une analyse complète, ou consultez la liste
                pour repérer les autres dossiers.
              </div>
            ),
          },
          { cle: "documents", label: "Documents", icon: "folder", compteur: dossier.nb_documents, contenu: <PanneauDocumentsDemo nb={dossier.nb_documents} /> },
          {
            cle: "copilote", label: "Copilote", icon: "chat",
            contenu: chat.length ? <CopiloteDemo questions={chat} /> : (
              <div className="empty">
                <div className="ic"><Icon name="chat" /></div>
                <b>Copilote non détaillé pour ce dossier de démonstration</b>
                Ouvrez LVMH ou Projet Helios pour tester des réponses sourcées.
              </div>
            ),
          },
          {
            cle: "controles", label: "Contrôles", icon: "split",
            alerte: contradictions.some((c) => c.gravite === "critique"),
            contenu: contradictions.length || checklist.length ? (
              <PanneauControlesDemo contradictions={contradictions} checklist={checklist} />
            ) : (
              <div className="empty">
                <div className="ic"><Icon name="check" /></div>
                <b>Aucune contradiction détectée</b>
                Ce dossier de démonstration n&apos;a pas été détaillé plus avant.
              </div>
            ),
          },
          { cle: "export", label: "Export", icon: "dl", contenu: <PanneauExportDemo /> },
        ]}
      />
    </>
  );
}
