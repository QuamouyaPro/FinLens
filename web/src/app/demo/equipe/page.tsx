import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { euros } from "@/lib/format";

export const metadata: Metadata = { title: "Équipe (démo) — FinLens" };

const MEMBRES = [
  { nom: "Camille Rousseau", email: "camille@meridian.fr", role: "Propriétaire", depuis: "12/01/2026" },
  { nom: "Julien Ferrand", email: "julien@meridian.fr", role: "Administrateur", depuis: "12/01/2026" },
  { nom: "Nadia Belkacem", email: "nadia@meridian.fr", role: "Membre", depuis: "03/03/2026" },
  { nom: "Thomas Aubry", email: "thomas@meridian.fr", role: "Membre", depuis: "18/04/2026" },
];

export default function DemoEquipePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Équipe</h1>
          <p>{MEMBRES.length} membres sur 5 sièges · un siège = une personne nommée</p>
        </div>
      </div>

      <div className="unl" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="u">
          <div className="l">Sièges facturés</div>
          <div className="v n">5</div>
        </div>
        <div className="u">
          <div className="l">Sièges occupés</div>
          <div className="v n">{MEMBRES.length}</div>
        </div>
        <div className="u">
          <div className="l">Sièges disponibles</div>
          <div className="v">{5 - MEMBRES.length}</div>
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
          {MEMBRES.map((membre, i) => (
            <tr key={membre.email}>
              <td>
                {membre.nom}
                {i === 0 ? <span className="badge badge--ok" style={{ marginLeft: 8 }}>Vous</span> : null}
                <div className="muted" style={{ fontSize: 12.5 }}>{membre.email}</div>
              </td>
              <td>{membre.role}</td>
              <td>{membre.depuis}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-banner" style={{ marginTop: 22 }}>
        <Icon name="users" />
        <span>
          L&apos;ajout d&apos;un siège modifie la facturation : {euros(580)}/mois jusqu&apos;au 10ᵉ
          siège, puis {euros(630)}/mois au-delà. Le partage de dossiers et les annotations
          d&apos;équipe sont propres à l&apos;offre Fonds.
        </span>
      </div>

      <Link href="/inscription" className="btn btn--primary" style={{ marginTop: 18 }}>
        Créer mon espace
      </Link>
    </>
  );
}
