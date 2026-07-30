import Link from "next/link";
import { IconSprite } from "@/components/ui/icon-sprite";
import { AppShell } from "@/components/app-shell/app-shell";
import { Icon } from "@/components/ui/icon";
import { DOSSIERS_ACTIFS, signauxNonLus } from "@/lib/demo";

/**
 * Mode démonstration ("Explorer la plateforme" de la landing, Note de
 * fonctionnement section 2.1). Toutes les données viennent du prototype et sont
 * statiques : aucun appel à Supabase ni à l'API Anthropic. L'offre "fonds"
 * permet de montrer les six profils, le comparateur et l'équipe sans blocage.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IconSprite />
      <AppShell
        base="/demo"
        offre="fonds"
        nomUtilisateur="Camille Rousseau"
        nomOrganisation="Meridian Capital (démo)"
        dossiersActifs={DOSSIERS_ACTIFS.length}
        signauxOuverts={signauxNonLus()}
        dossiersRaccourcis={DOSSIERS_ACTIFS.map((d) => ({
          id: d.id,
          name: d.name,
          secteur: d.sector,
        }))}
        banniere={
          <div className="demo-banner">
            <Icon name="lens" />
            <span className="txt">
              Mode démonstration — dossiers, analyses et réponses préconstruits pour illustrer le
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
