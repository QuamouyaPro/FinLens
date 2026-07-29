import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

const erasureSchema = z.object({ scope: z.enum(["compte"]).default("compte") });

/**
 * Droit à l'effacement en self-service (Note d'Architecture, section H) :
 * 1. déclenchement (bouton "Supprimer mon compte")
 * 2. identification + purge réelle (Supabase, anonymisation Stripe)
 * 3. trace de conformité minimale, sans les données effacées
 *
 * Périmètre "compte" uniquement ici : les dossiers d'une organisation partagée
 * (offre Fonds) ne sont pas supprimés, seule la référence personnelle de
 * l'utilisateur est détachée (owner_id -> NULL). Une demande émanant d'un tiers
 * mentionné dans un document appartenant à un client soulève des questions de
 * base légale à trancher par un juriste (hors périmètre technique de cette route).
 */
export async function POST(request: NextRequest) {
  try {
    const { user, organizationId } = await requireAuthContext();
    const { scope } = erasureSchema.parse(await request.json().catch(() => ({})));

    const admin = getSupabaseAdmin();

    const { data: erasureRequest, error: insertError } = await admin
      .from("erasure_requests")
      .insert({ organization_id: organizationId, requested_by: user.id, scope })
      .select()
      .single();
    if (insertError) throw insertError;

    const { data: org } = await admin
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", organizationId)
      .maybeSingle();

    // Anonymisation du profil Stripe -- les factures elles-mêmes restent
    // conservées pour les obligations comptables et fiscales.
    if (org?.stripe_customer_id) {
      try {
        const stripe = getStripe();
        await stripe.customers.update(org.stripe_customer_id, {
          name: "Compte supprimé",
          email: `deleted-${user.id}@finlens.invalid`,
        });
      } catch (stripeError) {
        console.error("Anonymisation Stripe échouée :", stripeError);
      }
    }

    // Purge réelle Supabase Auth : cascade vers memberships (ON DELETE CASCADE),
    // détache les références personnelles ailleurs (ON DELETE SET NULL, voir
    // migration erasure_fk_set_null).
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw new ApiError(500, `Échec de la suppression du compte : ${deleteError.message}`);

    await admin
      .from("erasure_requests")
      .update({
        executed_at: new Date().toISOString(),
        perimeter_summary: "Compte utilisateur supprimé ; références personnelles détachées des dossiers partagés.",
      })
      .eq("id", erasureRequest.id);

    return NextResponse.json({ status: "compte supprimé" });
  } catch (error) {
    return handleApiError(error);
  }
}
