'use server'

import { getSubscription } from "@/db/data/subscriptions";

export async function isUserSubscribed(userId) {
    if (!userId) {
        return false;
    }

    const subscriptions = await getSubscription(userId);

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
        return false;
    }

    // Check if at least one subscription is valid.
    const nowIsoString = new Date().toISOString();
    return subscriptions.some(subscription => {
        const hasCustomerId = !!subscription.stripeCustomerId;
        const hasValidPeriodEnd = subscription.stripeCurrentPeriodEnd && subscription.stripeCurrentPeriodEnd > nowIsoString;
        return hasCustomerId && hasValidPeriodEnd;
    });
}