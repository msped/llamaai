
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { updateUser } from "@/db/data/user";

export async function POST(req) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return new Response(
            `Webhook Error: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
            { status: 400 }
        );
    }

    const session = event.data.object;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        );

        await db.insert(subscriptions).values({
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            ).toISOString(),
        });
    } else if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        );

        await db
        .update(subscriptions)
        .set({
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
            ).toISOString(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
    } else if (event.type === "customer.subscription.updated") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        );

        await db
        .update(subscriptions)
        .set({
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
            ).toISOString(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
    } else if (event.type === "customer.subscription.deleted") {
        await db
        .delete(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, session.subscription));
    } else if (event.type === "customer.created") {
        updateUser(session.metadata.userId, {
            customerId: session.id,
        });
    }
    return new Response(null, { status: 200 });
}