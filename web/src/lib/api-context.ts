import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Utilisateur authentifié + organisation active (première appartenance). */
export async function requireAuthContext() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ApiError(401, "Authentification requise.");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    throw new ApiError(403, "Aucune organisation associée à ce compte.");
  }

  return { supabase, user, organizationId: membership.organization_id, role: membership.role };
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : "Erreur inconnue.";

  if (error instanceof Error && (error.name === "QuotaExceededError" || error.name === "ThrottledError")) {
    return NextResponse.json({ error: message }, { status: 429 });
  }

  console.error(error);
  return NextResponse.json({ error: message }, { status: 500 });
}
