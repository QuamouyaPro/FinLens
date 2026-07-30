import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { dateCourte, euros } from "@/lib/format";

export const metadata: Metadata = { title: "Équipe — FinLens" };

const PRIX_SIEGE = 580;
const PRIX_SIEGE_PALIER = 630;
const SIEGES_AVANT_PALIER = 10;

export default async function EquipePage() {
  const session = await requireSession();

  // La gestion multi-sièges est propre à l'offre Fonds (Note de fonctionnement, 15.2).
  if (session.offre !== "fonds") {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Équipe</h1>
            <p>Sièges nommés, partage de dossiers et annotations d&apos;équipe.</p>
          </div>
        </div>

        <div className="empty">
          <div className="ic">
            <Icon name="users" />
          </div>
          <b>Le travail en équipe fait partie de l&apos;offre Fonds</b>
          <span style={{ display: "block", marginBottom: 18 }}>
            Un siège = une personne, un compte nommé. {euros(PRIX_SIEGE)}/mois par siège jusqu&apos;au
            10ᵉ, {euros(PRIX_SIEGE_PALIER)}/mois au-delà.
          </span>
          <Link href="/facturation" className="btn btn--primary">
            Voir les offres
          </Link>
        </div>
      </>
    );
  }

  const supabase = await getSupabaseServer();
  const { data: membres } = await supabase
    .from("memberships")
    .select("id, role, created_at, user_id")
    .eq("organization_id", session.organizationId)
    .order("created_at", { ascending: true });

  const nbMembres = (membres ?? []).length;
  const siegesLibres = Math.max(session.seatsIncluded - nbMembres, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Équipe</h1>
          <p>
            {nbMembres} membre{nbMembres > 1 ? "s" : ""} sur {session.seatsIncluded} siège
            {session.seatsIncluded > 1 ? "s" : ""} · un siège = une personne nommée
          </p>
        </div>
      </div>

      <div className="unl" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="u">
          <div className="l">Sièges facturés</div>
          <div className="v n">{session.seatsIncluded}</div>
        </div>
        <div className="u">
          <div className="l">Sièges occupés</div>
          <div className="v n">{nbMembres}</div>
        </div>
        <div className="u">
          <div className="l">Sièges disponibles</div>
          <div className="v">{siegesLibres}</div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Membre</th>
            <th scope="col">Rôle</th>
            <th scope="col">Depuis</th>
          </tr>
        </thead>
        <tbody>
          {(membres ?? []).map((membre) => (
            <tr key={membre.id}>
              <td>
                {membre.user_id === session.userId ? (
                  <>
                    {session.email} <span className="badge badge--ok">Vous</span>
                  </>
                ) : (
                  <span className="mono" style={{ fontSize: 12.5 }}>
                    {membre.user_id.slice(0, 8)}…
                  </span>
                )}
              </td>
              <td>
                {membre.role === "owner" ? "Propriétaire" : membre.role === "admin" ? "Administrateur" : "Membre"}
              </td>
              <td>{dateCourte(membre.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-banner" style={{ marginTop: 22 }}>
        <Icon name="users" />
        <span>
          L&apos;ajout d&apos;un siège modifie votre facturation :{" "}
          {euros(PRIX_SIEGE)}/mois jusqu&apos;au {SIEGES_AVANT_PALIER}ᵉ siège, puis{" "}
          {euros(PRIX_SIEGE_PALIER)}/mois au-delà. Écrivez-nous pour ajuster votre contrat.
        </span>
      </div>

      <a
        href={`mailto:contact@finlens.fr?subject=Ajout%20de%20si%C3%A8ges%20FinLens&body=Organisation%20%3A%20${encodeURIComponent(session.organizationName)}`}
        className="btn btn--primary"
        style={{ marginTop: 18 }}
      >
        <Icon name="plus" style={{ width: 15, height: 15 }} />
        Demander des sièges
      </a>
    </>
  );
}
