"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreateWorkspaceState = { error: string } | undefined;

export async function createWorkspace(
  _prevState: CreateWorkspaceState,
  formData: FormData
): Promise<CreateWorkspaceState> {
  const name = String(formData.get("name") ?? "").trim();
  const target_company = String(formData.get("target_company") ?? "").trim();

  if (!name) {
    return { error: "Le nom de l'espace de travail est requis." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({ name, target_company: target_company || null, user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Impossible de créer l'espace de travail." };
  }

  redirect(`/workspace/${data.id}`);
}
