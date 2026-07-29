import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Client scopé à l'utilisateur connecté (RLS active). À utiliser dans les routes
 * API/route handlers pour toute lecture/écriture qui doit respecter les permissions
 * de l'utilisateur (appartenance à l'organisation, rôle...).
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component : ignoré, le middleware
            // rafraîchit déjà la session.
          }
        },
      },
    }
  );
}
