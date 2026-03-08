import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { reports, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

function getSubscriptionPeriodEnd(sub: Stripe.Subscription): Date {
  const item = sub.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000);
  }
  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const toolSlug = session.metadata?.tool;
      const query = session.metadata?.query;

      if (!toolSlug || !query) break;

      if (session.mode === "payment") {
        await db.insert(reports).values({
          tool: toolSlug,
          input: { query },
          paid: true,
          amount: String((session.amount_total ?? 0) / 100),
        });
      }

      if (session.mode === "subscription" && session.subscription) {
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        await db.insert(subscriptions).values({
          tool: toolSlug,
          stripeSubId: subId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId: "00000000-0000-0000-0000-000000000000", // placeholder until user linking
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({
          status: sub.status,
          currentPeriodEnd: getSubscriptionPeriodEnd(sub),
        })
        .where(eq(subscriptions.stripeSubId, sub.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
