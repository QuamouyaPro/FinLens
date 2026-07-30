import { IconSprite } from "@/components/ui/icon-sprite";
import { AppShell } from "@/components/app-shell/app-shell";
import { requireSession } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const supabase = await getSupabaseServer();

  // Compteurs de la barre latérale et raccourcis de la palette, en une passe.
  const [{ count: dossiersActifs }, { count: signauxOuverts }, { data: dossiers }] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", session.organizationId)
      .eq("status", "actif"),
    supabase
      .from("contradictions")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", session.organizationId)
      .eq("status", "ouverte"),
    supabase
      .from("dossiers")
      .select("id, name, type_operation")
      .eq("organization_id", session.organizationId)
      .in("status", ["actif", "archive"])
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  const nomUtilisateur = session.email.split("@")[0] || "Vous";

  return (
    <>
      <IconSprite />
      <AppShell
        offre={session.offre}
        nomUtilisateur={nomUtilisateur}
        nomOrganisation={session.organizationName}
        dossiersActifs={dossiersActifs ?? 0}
        signauxOuverts={signauxOuverts ?? 0}
        dossiersRaccourcis={(dossiers ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          secteur: d.type_operation,
        }))}
      >
        {children}
      </AppShell>
    </>
  );
}
