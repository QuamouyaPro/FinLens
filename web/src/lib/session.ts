import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type SessionContext = {
  userId: string;
  email: string;
  organizationId: string;
  organizationName: string;
  offre: Enums<"offre">;
  seatsIncluded: number;
  role: string;
};

/**
 * Contexte de session pour les Server Components. Redirige vers la connexion
 * plutôt que de lever une erreur — c'est le pendant de requireAuthContext(),
 * qui sert aux routes API.
 */
export async function requireSession(): Promise<SessionContext> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: membership } = await supabase
    .from("memberships")
    .select("role, organization_id, organizations(id, name, offre, seats_included)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  // Le trigger on_auth_user_created crée l'organisation à l'inscription. Si elle
  // manque (compte créé avant ce trigger), on renvoie vers une page qui l'explique
  // plutôt que de laisser l'app planter.
  if (!membership?.organizations) redirect("/connexion?erreur=organisation_absente");

  const org = membership.organizations;

  return {
    userId: user.id,
    email: user.email ?? "",
    organizationId: org.id,
    organizationName: org.name,
    offre: org.offre,
    seatsIncluded: org.seats_included,
    role: membership.role,
  };
}

export async function getOptionalSession() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
