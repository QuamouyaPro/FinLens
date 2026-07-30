import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { connexion } from "../actions";
import { getOptionalSession } from "@/lib/session";

export const metadata: Metadata = { title: "Se connecter — FinLens" };

const MESSAGES: Record<string, string> = {
  organisation_absente:
    "Votre compte n'est rattaché à aucun espace de travail. Contactez l'administrateur de votre organisation pour recevoir une invitation.",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const user = await getOptionalSession();
  const { erreur } = await searchParams;

  // Un utilisateur déjà connecté n'a rien à faire sur cet écran, sauf si sa
  // session est justement le problème signalé.
  if (user && !erreur) redirect("/tableau-de-bord");

  return (
    <AuthForm
      mode="connexion"
      action={connexion}
      messageInitial={erreur ? MESSAGES[erreur] : undefined}
    />
  );
}
