import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { SuppressionCompte } from "@/components/compte/suppression-compte";
import { deconnexion } from "@/app/(auth)/actions";
import { OFFRES } from "@/lib/offres";

export const metadata: Metadata = { title: "Réglages — FinLens" };

export default async function ReglagesPage() {
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  const { data: organisation } = await supabase
    .from("organizations")
    .select("data_residency, created_at")
    .eq("id", session.organizationId)
    .maybeSingle();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Réglages</h1>
          <p>Votre compte, votre espace de travail et le traitement de vos documents.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Compte</h3>

        <div className="row2">
          <div className="field">
            <label htmlFor="email-compte">Adresse e-mail</label>
            <input id="email-compte" className="input" value={session.email} readOnly />
          </div>
          <div className="field">
            <label htmlFor="org-compte">Espace de travail</label>
            <input id="org-compte" className="input" value={session.organizationName} readOnly />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="offre-compte">Offre</label>
            <input id="offre-compte" className="input" value={`FinLens ${OFFRES[session.offre].label}`} readOnly />
          </div>
          <div className="field">
            <label htmlFor="role-compte">Votre rôle</label>
            <input
              id="role-compte"
              className="input"
              value={
                session.role === "owner"
                  ? "Propriétaire"
                  : session.role === "admin"
                    ? "Administrateur"
                    : "Membre"
              }
              readOnly
            />
          </div>
        </div>

        <form action={deconnexion}>
          <button type="submit" className="btn btn--ghost btn--sm">
            <Icon name="logout" style={{ width: 14, height: 14 }} />
            Se déconnecter
          </button>
        </form>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, marginBottom: 7 }}>Confidentialité de vos documents</h3>
        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.65, marginBottom: 18 }}>
          Ce qui arrive concrètement aux pièces que vous déposez.
        </p>

        <div className="trust" style={{ gridTemplateColumns: "1fr", gap: 12, marginTop: 0 }}>
          <div className="t">
            <div className="ic">
              <Icon name="shield" />
            </div>
            <div>
              <b>Cloisonnés par espace de travail</b>
              <p>
                Vos documents ne sont accessibles qu&apos;aux membres de votre organisation, appliqué au
                niveau de la base de données elle-même.
              </p>
            </div>
          </div>

          <div className="t">
            <div className="ic">
              <Icon name="lens" />
            </div>
            <div>
              <b>Jamais utilisés pour entraîner un modèle public</b>
              <p>
                L&apos;analyse passe par l&apos;API Anthropic sous contrat commercial : vos contenus
                n&apos;alimentent aucun entraînement.
              </p>
            </div>
          </div>

          <div className="t">
            <div className="ic">
              <Icon name="bank" />
            </div>
            <div>
              <b>Hébergés en Union européenne</b>
              <p>
                Base de données et stockage en région {organisation?.data_residency ?? "eu-central-1"}{" "}
                (Francfort). Seul le flux d&apos;analyse sort de l&apos;UE, encadré contractuellement.
              </p>
            </div>
          </div>

          <div className="t">
            <div className="ic">
              <Icon name="trash" />
            </div>
            <div>
              <b>Suppression réelle, avec 30 jours pour changer d&apos;avis</b>
              <p>
                Un dossier supprimé part en corbeille 30 jours, puis est purgé de la base et de
                l&apos;index documentaire. Rien n&apos;est conservé au-delà.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SuppressionCompte />
    </>
  );
}
