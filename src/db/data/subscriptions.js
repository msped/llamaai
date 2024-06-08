import { db } from "@/db/index";
import { subscriptions } from "../schema";
import { eq } from "drizzle-orm";

export async function getSubscription(userId) {
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId))
    return subscription;
}