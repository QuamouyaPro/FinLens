import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthContext, handleApiError, ApiError } from "@/lib/api-context";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";

const checkoutSchema = z.object({
  offre: z.enum(["essentiel", "analyste", "fonds"]),
  // Fonds : 5 sièges inclus, sièges additionnels jusqu'au 10e à 580€, puis 630€
  // (Coûts & Pricing, section 7). Ignoré pour essentiel/analyste (1 siège fixe).
  sieges_supplementaires: z.number().int().min(0).max(200).optional(),
});

/** Crée une session Stripe Checkout pour l'une des 3 offres FinLens. */
export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await requireAuthContext();
    const body = checkoutSchema.parse(await request.json());
    const stripe = getStripe();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const lineItems: { price: string; quantity: number }[] = [];

    if (body.offre === "essentiel") {
      if (!STRIPE_PRICE_IDS.essentiel) throw new ApiError(500, "STRIPE_PRICE_ESSENTIEL non configuré.");
      lineItems.push({ price: STRIPE_PRICE_IDS.essentiel, quantity: 1 });
    } else if (body.offre === "analyste") {
      if (!STRIPE_PRICE_IDS.analyste) throw new ApiError(500, "STRIPE_PRICE_ANALYSTE non configuré.");
      lineItems.push({ price: STRIPE_PRICE_IDS.analyste, quantity: 1 });
    } else {
      if (!STRIPE_PRICE_IDS.fonds_siege) throw new ApiError(500, "STRIPE_PRICE_FONDS_SIEGE non configuré.");
      const extra = body.sieges_supplementaires ?? 0;
      const withinPalier = Math.min(extra, 5); // 5 inclus + jusqu'à 5 de plus = 10 avant palier
      const beyondPalier = Math.max(extra - 5, 0);

      lineItems.push({ price: STRIPE_PRICE_IDS.fonds_siege, quantity: 5 + withinPalier });
      if (beyondPalier > 0) {
        if (!STRIPE_PRICE_IDS.fonds_siege_palier) {
          throw new ApiError(500, "STRIPE_PRICE_FONDS_SIEGE_PALIER non configuré.");
        }
        lineItems.push({ price: STRIPE_PRICE_IDS.fonds_siege_palier, quantity: beyondPalier });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${appUrl}/facturation?checkout=success`,
      cancel_url: `${appUrl}/facturation?checkout=cancel`,
      client_reference_id: organizationId,
      metadata: { organization_id: organizationId, offre: body.offre },
      subscription_data: { metadata: { organization_id: organizationId, offre: body.offre } },
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
