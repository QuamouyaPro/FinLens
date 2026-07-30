"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";

export type AuthState = { erreur?: string; info?: string };

/** Traduit les messages d'erreur Supabase, qui sont en anglais. */
function messageErreur(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("invalid login credentials")) return "Adresse e-mail ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) return "Confirmez votre adresse e-mail avant de vous connecter.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Un compte existe déjà avec cette adresse. Connectez-vous.";
  if (m.includes("password should be at least"))
    return "Le mot de passe doit contenir au moins 8 caractères.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Cette adresse e-mail n'est pas valide.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  return raw;
}

export async function connexion(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { erreur: "Renseignez votre adresse e-mail et votre mot de passe." };

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { erreur: messageErreur(error.message) };

  revalidatePath("/", "layout");
  redirect("/tableau-de-bord");
}

export async function inscription(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const organizationName = String(formData.get("organization_name") ?? "").trim();

  if (!email || !password) return { erreur: "Renseignez votre adresse e-mail et un mot de passe." };
  if (password.length < 8) return { erreur: "Le mot de passe doit contenir au moins 8 caractères." };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Repris par le trigger on_auth_user_created pour nommer l'organisation.
    options: { data: { full_name: fullName, organization_name: organizationName } },
  });

  if (error) return { erreur: messageErreur(error.message) };

  // Si la confirmation d'e-mail est activée dans Supabase, aucune session n'est
  // ouverte : on l'annonce plutôt que de rediriger vers une app inaccessible.
  if (!data.session) {
    return {
      info: "Compte créé. Ouvrez l'e-mail de confirmation que nous venons de vous envoyer pour activer votre accès.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/tableau-de-bord");
}

export async function deconnexion() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/connexion");
}
