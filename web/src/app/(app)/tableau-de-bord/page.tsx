import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { dateRelative, initiale } from "@/lib/format";
import { OFFRES, TYPES_OPERATION, niveauRisque } from "@/lib/offres";

export const metadata: Metadata = { title: "Tableau de bord — FinLens" };

/** Un dossier sans activité depuis ce délai remonte dans la file de priorité. */
const JOURS_INACTIVITE = 7;

export default async function TableauDeBordPage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();
  const config = OFFRES[session.offre];

  const maintenant = new Date();
  const debutDuMois = new Date(maintenant);
  debutDuMois.setDate(1);
  debutDuMois.setHours(0, 0, 0, 0);

  const [
    { data: dossiers },
    { data: contradictions },
    { data: extractionsDuMois },
    { count: questionsDuMois },
    { data: dossiersSansDocument },
  ] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id, name, status, type_operation, risk_score, updated_at")
      .eq("organization_id", session.organizationId)
      .eq("status", "actif")
      .order("updated_at", { ascending: false }),
    supabase
      .from("contradictions")
      .select("id, gravite, description, status, dossier_id, dossiers(name)")
      .eq("organization_id", session.organizationId)
      .eq("status", "ouverte")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("extractions")
      .select("id")
      .eq("organization_id", session.organizationId)
      .gte("created_at", debutDuMois.toISOString()),
    supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", session.organizationId)
      .eq("role", "user")
      .gte("created_at", debutDuMois.toISOString()),
    supabase
      .from("dossiers")
      .select("id, name, documents(id)")
      .eq("organization_id", session.organizationId)
      .eq("status", "actif"),
  ]);

  const actifs = dossiers ?? [];
  const analysesDuMois = (extractionsDuMois ?? []).length;
  const questions = questionsDuMois ?? 0;

  // Le temps économisé s'appuie sur l'hypothèse produit : ~14 h de lecture par
  // dossier, dont FinLens reprend 70 % (voir le calculateur de la page publique).
  const heuresEconomisees = Math.round(analysesDuMois * 14 * 0.7);

  const sansDocument = (dossiersSansDocument ?? []).filter(
    (d) => !d.documents || (Array.isArray(d.documents) && d.documents.length === 0)
  );

  const seuilInactivite = new Date(maintenant.getTime() - JOURS_INACTIVITE * 24 * 60 * 60 * 1000);
  const inactifs = actifs.filter((d) => new Date(d.updated_at) < seuilInactivite);

  const parEtape = {
    screening: actifs.filter((d) => d.type_operation === "screening").length,
    due_diligence: actifs.filter((d) => d.type_operation === "due_diligence").length,
    lbo: actifs.filter((d) => d.type_operation === "lbo").length,
    serie_a_b: actifs.filter((d) => d.type_operation === "serie_a_b").length,
    veille: actifs.filter((d) => d.type_operation === "veille").length,
  };

  const aucuneActivite = actifs.length === 0;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Ce qui demande une décision aujourd&apos;hui, avant les statistiques.</p>
        </div>
      </div>

      {aucuneActivite ? (
        <div className="empty" style={{ marginBottom: 26 }}>
          <div className="ic">
            <Icon name="folder" />
          </div>
          <b>Votre espace est prêt</b>
          <span style={{ display: "block", marginBottom: 18 }}>
            Créez un dossier par entreprise étudiée, déposez-y les documents, et recevez une synthèse
            sourcée à la page.
          </span>
          <Link href="/dossiers?nouveau=1" className="btn btn--primary">
            <Icon name="plus" style={{ width: 15, height: 15 }} />
            Créer mon premier dossier
          </Link>
        </div>
      ) : null}

      {(contradictions ?? []).length > 0 || sansDocument.length > 0 || inactifs.length > 0 ? (
        <>
          <div className="block-h">
            <h2>À traiter en priorité</h2>
          </div>
          <div className="prio">
            {(contradictions ?? []).map((contradiction) => (
              <Link
                href={`/dossiers/${contradiction.dossier_id}`}
                className={`prio__i ${contradiction.gravite === "critique" ? "crit" : "warn"}`}
                key={contradiction.id}
              >
                <span className="ic">
                  <Icon name="split" />
                </span>
                <span className="tx">
                  <span className="t">
                    Contradiction {contradiction.gravite === "critique" ? "critique" : "à vérifier"} —{" "}
                    {(contradiction.dossiers as { name: string } | null)?.name ?? "dossier"}
                  </span>
                  <span className="s">{contradiction.description.slice(0, 120)}</span>
                </span>
                <span className="go">
                  Arbitrer
                  <Icon name="split" />
                </span>
              </Link>
            ))}

            {sansDocument.slice(0, 3).map((dossier) => (
              <Link href={`/dossiers/${dossier.id}`} className="prio__i info" key={dossier.id}>
                <span className="ic">
                  <Icon name="doc" />
                </span>
                <span className="tx">
                  <span className="t">{dossier.name} attend ses documents</span>
                  <span className="s">Aucune pièce déposée — l&apos;analyse ne peut pas démarrer.</span>
                </span>
                <span className="go">
                  Déposer
                  <Icon name="dl" />
                </span>
              </Link>
            ))}

            {inactifs.slice(0, 2).map((dossier) => (
              <Link href={`/dossiers/${dossier.id}`} className="prio__i info" key={dossier.id}>
                <span className="ic">
                  <Icon name="clock" />
                </span>
                <span className="tx">
                  <span className="t">{dossier.name} est sans activité</span>
                  <span className="s">Dernière modification {dateRelative(dossier.updated_at)}.</span>
                </span>
                <span className="go">
                  Reprendre
                  <Icon name="restore" />
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <div className="kpis">
        <div className="kpi">
          <div className="lbl">
            <Icon name="folder" />
            Dossiers ouverts
          </div>
          <div className="val">
            {actifs.length}
            <small> / {config.dossiersActifsMax}</small>
          </div>
          <div className="delta flat">Archivez pour libérer un emplacement</div>
        </div>

        <div className="kpi">
          <div className="lbl">
            <Icon name="lens" />
            Analyses ce mois
          </div>
          <div className="val">
            {analysesDuMois}
            {config.dossiersAnalysesParMois ? (
              <small> / {config.dossiersAnalysesParMois}</small>
            ) : (
              <span className="inf"> illimité</span>
            )}
          </div>
          <div className="delta flat">Extraction complète du dossier</div>
        </div>

        <div className="kpi">
          <div className="lbl">
            <Icon name="chat" />
            Questions posées
          </div>
          <div className="val">
            {questions}
            {config.questionsParMois ? (
              <small> / {config.questionsParMois}</small>
            ) : (
              <span className="inf"> illimité</span>
            )}
          </div>
          <div className="delta flat">Ce mois-ci, tous dossiers confondus</div>
        </div>

        <div className="kpi">
          <div className="lbl">
            <Icon name="clock" />
            Temps économisé
          </div>
          <div className="val">
            {heuresEconomisees}
            <small> h</small>
          </div>
          <div className="delta up">Estimé sur les analyses du mois</div>
        </div>
      </div>

      {actifs.length > 0 ? (
        <>
          <div className="block-h">
            <h2>Répartition par type d&apos;opération</h2>
          </div>
          <div className="pipe">
            {(
              [
                ["screening", "Screening", "var(--info)"],
                ["due_diligence", "Due diligence", "var(--accent)"],
                ["lbo", "LBO", "var(--signal)"],
                ["serie_a_b", "Série A / B", "var(--accent-strong)"],
                ["veille", "Veille", "var(--text-faint)"],
              ] as const
            ).map(([cle, label, couleur]) => (
              <Link href="/dossiers" className="st" key={cle}>
                <div className="n">
                  <i style={{ background: couleur }} />
                  {label}
                </div>
                <div className="c">{parEtape[cle]}</div>
                <div className="m">dossier{parEtape[cle] > 1 ? "s" : ""}</div>
              </Link>
            ))}
          </div>

          <div className="block-h">
            <h2>Reprendre</h2>
            <Link href="/dossiers">Tous les dossiers</Link>
          </div>

          {actifs.slice(0, 5).map((dossier) => (
            <Link href={`/dossiers/${dossier.id}`} className="d-row" key={dossier.id}>
              <span className="thumb">{initiale(dossier.name)}</span>
              <span className="meta">
                <span className="t">{dossier.name}</span>
                <span className="s">
                  <span>{TYPES_OPERATION[dossier.type_operation]}</span>
                </span>
              </span>
              {dossier.risk_score !== null ? (
                <span className={`risk risk-${niveauRisque(dossier.risk_score)}`}>{dossier.risk_score}</span>
              ) : (
                <span className="badge badge--muted">Non analysé</span>
              )}
              <span className="when">{dateRelative(dossier.updated_at)}</span>
            </Link>
          ))}
        </>
      ) : null}
    </>
  );
}
