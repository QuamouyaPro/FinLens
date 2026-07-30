import Link from "next/link";
import { IconSprite } from "@/components/ui/icon-sprite";
import { AppShell } from "@/components/app-shell/app-shell";
import { Icon } from "@/components/ui/icon";
import { DEMO_DOSSIERS, DEMO_SIGNAUX } from "@/lib/demo/fixtures";

/**
 * Mode démonstration ("Explorer la plateforme" de la landing, Note de
 * fonctionnement section 2.1) : données entièrement fictives et codées en dur,
 * aucun appel à Supabase ni à l'API Anthropic. Offre "fonds" pour montrer les
 * six profils et le comparateur sans restriction.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const dossiersActifs = DEMO_DOSSIERS.length;
  const signauxOuverts = DEMO_SIGNAUX.filter((s) => s.nonLu).length;

  return (
    <>
      <IconSprite />
      <AppShell
        base="/demo"
        offre="fonds"
        nomUtilisateur="Camille Rousseau"
        nomOrganisation="Meridian Capital (démo)"
        dossiersActifs={dossiersActifs}
        signauxOuverts={signauxOuverts}
        dossiersRaccourcis={DEMO_DOSSIERS.map((d) => ({ id: d.id, name: d.name, secteur: d.sector }))}
        banniere={
          <div
            style={{
              background: "var(--accent-wash)",
              borderBottom: "1px solid var(--accent-tint)",
              padding: "10px 32px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13.5,
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            <Icon name="lens" style={{ width: 15, height: 15, flex: "none" }} />
            <span style={{ flex: 1 }}>
              Mode démonstration — dossiers et réponses fictifs, préconstruits pour illustrer le
              produit. Aucune donnée n&apos;est envoyée à un moteur d&apos;analyse.
            </span>
            <Link href="/inscription" className="btn btn--primary btn--sm" style={{ flex: "none" }}>
              Créer mon vrai espace
            </Link>
          </div>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
