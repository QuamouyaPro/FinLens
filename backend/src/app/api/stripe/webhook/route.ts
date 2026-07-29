import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Webhook Stripe. Le quota Essentiel se réinitialise individuellement pour
 * chaque abonné via invoice.paid (fenêtre de prélèvement étalée du 1er au 6 du
 * mois), pas à date fixe pour tous (Coûts & Pricing, section 9).
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Configuration webhook manquante." }, { status: 500 });
  }

  const stripe = getStripe();
  const admin = getSupabaseAdmin();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: `Signature invalide : ${(error as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organization_id;
      const offre = session.metadata?.offre as "essentiel" | "analyste" | "fonds" | undefined;
      if (!organizationId || !offre) break;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      await admin
        .from("organizations")
        .update({
          offre,
          stripe_customer_id:
            typeof session.customer === "string" ? session.customer : session.customer?.id,
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", organizationId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const organizationId = subscription.metadata?.organization_id;
      if (!organizationId) break;

      const seatsIncluded = subscription.items.data.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

      await admin
        .from("organizations")
        .update({ seats_included: seatsIncluded })
        .eq("id", organizationId);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionRef = invoice.parent?.subscription_details?.subscription;
      const subscriptionId = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;
      if (!subscriptionId) break;

      const { data: org } = await admin
        .from("organizations")
        .select("id, offre")
        .eq("stripe_subscription_id", subscriptionId)
        .maybeSingle();

      if (org?.offre === "essentiel") {
        const cycleStart = new Date();
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setMonth(cycleEnd.getMonth() + 1);

        await admin.from("quotas_essentiel").insert({
          organization_id: org.id,
          cycle_start: cycleStart.toISOString(),
          cycle_end: cycleEnd.toISOString(),
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
