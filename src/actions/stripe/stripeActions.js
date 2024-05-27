"use server";

import { auth } from "@/auth"
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function generateStripeSessionAction(priceId) {
    const session = await auth();

    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!session.user) {
        throw new Error("Unauthorized");
    }

    if (!session.user.email) {
        throw new Error("Email is required");
    }

    if (!session.user.id) {
        throw new Error("userId is required");
    }

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: session.user.email,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            userId: session.user.id,
        },
    });

    redirect(stripeSession.url);
}