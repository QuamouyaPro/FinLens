import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { BoutonCheckout } from "@/components/compte/bouton-checkout";
import { OFFRES } from "@/lib/offres";
import { dateCourte, euros } from "@/lib/format";

export const metadata: Metadata = { title: "Facturation — FinLens" };

export default async function FacturationPage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();
  const config = OFFRES[session.offre];
  const illimite = config.questionsParMois === null;

  const [{ data: quota }, { count: dossiersActifs }] = await Promise.all([
    supabase
      .from("quotas_essentiel")
      .select("*")
      .eq("organization_id", session.organizationId)
      .lte("cycle_start", new Date().toISOString())
      .gt("cycle_end", new Date().toISOString())
      .maybeSingle(),
    supabase
      .from("dossiers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", session.organizationId)
      .eq("status", "actif"),
  ]);

  const prixTotal =
    session.offre === "fonds" ? config.prixMensuel : config.prixMensuel;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Facturation</h1>
          <p>Votre offre, ce qu&apos;elle inclut, et ce qu&apos;il vous reste ce mois-ci.</p>
        </div>
      </div>

      <div className="plan-card noise">
        <div className="pc-l">
          <h3>
            FinLens {config.label}
            <span className="badge badge--ink">Offre active</span>
          </h3>
          <p>
            {illimite
              ? `Dossiers, documents, pages et questions illimités · ${config.dossiersActifsMax} dossiers ouverts simultanément`
              : `${config.dossiersActifsMax} dossiers actifs · ${config.dossiersAnalysesParMois} analyses et ${config.questionsParMois} questions par mois`}
            {session.offre === "fonds" ? ` · ${session.seatsIncluded} siège${session.seatsIncluded > 1 ? "s" : ""}` : ""}
          </p>
        </div>
        <div className="pc-price">
          {euros(prixTotal)}
          <small> / mois</small>
        </div>
      </div>

      {illimite ? (
        <>
          <div className="note-banner">
            <Icon name="lens" />
            <span>
              Aucun compteur de questions, aucun dépassement facturé. Le seul plafond visible est le
              nombre de dossiers ouverts en même temps — archivez un dossier terminé pour en libérer un.
            </span>
          </div>

          <div className="unl">
            <div className="u">
              <div className="l">Dossiers analysés</div>
              <div className="v">Illimité</div>
            </div>
            <div className="u">
              <div className="l">Questions au Copilote</div>
              <div className="v">Illimité</div>
            </div>
            <div className="u">
              <div className="l">Pages par document</div>
              <div className="v">Illimité</div>
            </div>
            <div className="u">
              <div className="l">Dossiers ouverts</div>
              <div className="v n">
                {dossiersActifs ?? 0} / {config.dossiersActifsMax}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="quota">
            <div className="qh">
              <span className="t">Nouvelles analyses de dossier</span>
              <span className="v">
                <b>{quota?.dossiers_analyses_count ?? 0}</b> / {quota?.dossiers_analyses_limit ?? 3}
              </span>
            </div>
            <div className="meter">
              <div
                className="meter__bar"
                style={{
                  width: `${Math.min(
                    ((quota?.dossiers_analyses_count ?? 0) / (quota?.dossiers_analyses_limit ?? 3)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="note">
              Rouvrir un dossier déjà analysé ne consomme rien — seule une nouvelle analyse compte.
            </p>
          </div>

          <div className="quota">
            <div className="qh">
              <span className="t">Questions au Copilote</span>
              <span className="v">
                <b>{quota?.questions_count ?? 0}</b> / {quota?.questions_limit ?? 100}
              </span>
            </div>
            <div className="meter">
              <div
                className="meter__bar"
                style={{
                  width: `${Math.min(
                    ((quota?.questions_count ?? 0) / (quota?.questions_limit ?? 100)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="note">
              {quota?.cycle_end
                ? `Remis à zéro au prochain prélèvement, le ${dateCourte(quota.cycle_end)}.`
                : "Remis à zéro à chaque prélèvement."}
            </p>
          </div>

          <div className="note-banner">
            <Icon name="lock" />
            <span>
              L&apos;offre Essentiel donne accès à 3 des 6 profils d&apos;analyse et n&apos;inclut pas le
              comparateur de dossiers. Consulter vos dossiers existants et exporter vos notes reste
              toujours possible, même quota atteint.
            </span>
          </div>
        </>
      )}

      <div className="block-h" style={{ margin: "30px 0 15px" }}>
        <h2>Changer d&apos;offre</h2>
      </div>

      <div className="pricing">
        {(["essentiel", "analyste", "fonds"] as const).map((cle) => {
          const offre = OFFRES[cle];
          const actuelle = cle === session.offre;

          return (
            <div className={`plan${actuelle ? " plan--feat" : ""}`} key={cle}>
              {actuelle ? <span className="plan__flag">Offre actuelle</span> : null}
              <span className="plan__tag">{offre.label}</span>
              <h3>
                {cle === "essentiel"
                  ? "Pour découvrir"
                  : cle === "analyste"
                    ? "Illimité, 1 siège"
                    : "Équipe, par siège"}
              </h3>
              <div className="price">
                {euros(offre.prixMensuel)}
                <small>{cle === "fonds" ? " dès / mois" : " / mois"}</small>
              </div>
              <div className="save-line" />
              <p className="sub">
                {cle === "essentiel"
                  ? "Quotas fermes, 3 profils d'analyse sur 6."
                  : cle === "analyste"
                    ? "Tout illimité, les 6 profils, comparateur inclus."
                    : "5 sièges inclus, partage de dossiers."}
              </p>
              <ul>
                <li>
                  <Icon name="check" />
                  {offre.dossiersActifsMax} dossiers ouverts simultanément
                </li>
                <li>
                  <Icon name="check" />
                  {offre.dossiersAnalysesParMois
                    ? `${offre.dossiersAnalysesParMois} analyses / mois`
                    : "Analyses illimitées"}
                </li>
                <li>
                  <Icon name="check" />
                  {offre.questionsParMois ? `${offre.questionsParMois} questions / mois` : "Questions illimitées"}
                </li>
                <li className={offre.comparateur ? "" : "no"}>
                  <Icon name={offre.comparateur ? "check" : "cross"} />
                  Comparateur de dossiers
                </li>
              </ul>

              {actuelle ? (
                <button type="button" className="btn btn--ghost btn--block" disabled>
                  Offre en cours
                </button>
              ) : cle === "fonds" ? (
                <a
                  href="mailto:contact@finlens.fr?subject=Demande%20de%20devis%20FinLens%20Fonds"
                  className="btn btn--ghost btn--block"
                >
                  Demander un devis
                </a>
              ) : (
                <BoutonCheckout
                  offre={cle}
                  libelle={`Passer à ${offre.label}`}
                  variante={cle === "analyste" ? "primary" : "ghost"}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
