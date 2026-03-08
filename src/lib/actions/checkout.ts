"use server";

import { stripe, TOOL_PRICES } from "@/lib/stripe";

type CheckoutResult = {
  success: true;
  url: string;
} | {
  success: false;
  error: string;
}

export async function createCheckoutSession(
  toolSlug: string,
  searchQuery: string,
): Promise<CheckoutResult> {
  const tool = TOOL_PRICES[toolSlug];
  if (!tool) {
    return { success: false, error: "Outil invalide." };
  }

  if (!searchQuery.trim()) {
    return { success: false, error: "Veuillez d'abord effectuer une recherche." };
  }

  try {
    const isSubscription = toolSlug === "garderies";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cliczone.ca";

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      currency: "cad",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: tool.label,
              description: `Recherche : « ${searchQuery} »`,
            },
            unit_amount: tool.amount,
            ...(isSubscription ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        tool: toolSlug,
        query: searchQuery,
      },
      success_url: `${baseUrl}/${toolSlug}?session_id={CHECKOUT_SESSION_ID}&success=1`,
      cancel_url: `${baseUrl}/${toolSlug}?canceled=1`,
      automatic_tax: { enabled: true },
    });

    if (!session.url) {
      return { success: false, error: "Impossible de créer la session de paiement." };
    }

    return { success: true, url: session.url };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return { success: false, error: "Erreur lors de la création du paiement. Réessayez." };
  }
}
