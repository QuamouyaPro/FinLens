import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Exports (démo) — FinLens" };

const EXPORTS = [
  { dossier: "LVMH — Rapport annuel 2024", modele: "Note d'investissement", profil: "PE / VC", format: "PDF", quand: "il y a 2 h" },
  { dossier: "Projet Helios — DD SaaS B2B", modele: "Due diligence complète", profil: "M&A", format: "Word", quand: "il y a 5 h" },
  { dossier: "Groupe Meridian — LBO", modele: "Note d'investissement", profil: "PE / VC", format: "PDF", quand: "il y a 3 j" },
  { dossier: "Castellane & Fils — Transmission", modele: "Screening rapide", profil: "Family Office", format: "PDF", quand: "la semaine dernière" },
];

const MODELES = [
  { icone: "doc" as const, titre: "Note d'investissement", detail: "Le format comité : thèse, chiffres clés, risques, sources en annexe." },
  { icone: "list" as const, titre: "Screening rapide", detail: "Deux pages : verdict, indicateurs, points bloquants." },
  { icone: "shield" as const, titre: "Due diligence complète", detail: "Toutes les sections, checklist incluse, contradictions détaillées." },
];

export default function DemoExportsPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Exports</h1>
          <p>Les documents générés depuis vos dossiers, avec le profil de lecture utilisé.</p>
        </div>
      </div>

      <div className="fmt-grid">
        {MODELES.map((modele) => (
          <div className="fmt" key={modele.titre}>
            <div className="ic">
              <Icon name={modele.icone} />
            </div>
            <h4>{modele.titre}</h4>
            <p>{modele.detail}</p>
          </div>
        ))}
      </div>

      <div className="block-h" style={{ margin: "30px 0 14px" }}>
        <h2>Historique</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Dossier</th>
            <th scope="col">Modèle</th>
            <th scope="col">Profil</th>
            <th scope="col">Format</th>
            <th scope="col">Généré</th>
          </tr>
        </thead>
        <tbody>
          {EXPORTS.map((item, i) => (
            <tr key={i}>
              <td>{item.dossier}</td>
              <td>{item.modele}</td>
              <td>{item.profil}</td>
              <td>
                <span className="badge badge--muted">{item.format}</span>
              </td>
              <td>{item.quand}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-banner" style={{ marginTop: 22 }}>
        <Icon name="dl" />
        <span>
          Démonstration : ces exports ne sont pas téléchargeables. Dans un vrai espace, chaque note
          part en PDF ou Word, sources conservées en annexe cliquable.
        </span>
      </div>

      <Link href="/inscription" className="btn btn--primary" style={{ marginTop: 18 }}>
        Créer mon espace
      </Link>
    </>
  );
}
