import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { inscription } from "../actions";
import { getOptionalSession } from "@/lib/session";

export const metadata: Metadata = { title: "Créer un espace — FinLens" };

export default async function InscriptionPage() {
  const user = await getOptionalSession();
  if (user) redirect("/tableau-de-bord");

  return <AuthForm mode="inscription" action={inscription} />;
}
