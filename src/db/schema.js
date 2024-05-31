import {
    timestamp,
    pgTable,
    text,
    integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull().unique(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    stripeCustomerId: text("stripeCustomerId"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        primaryKey: [account.provider, account.providerAccountId],
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        primaryKey: [vt.identifier, vt.token],
    })
);

export const subscriptions = pgTable("subscriptions", {
    userId: text("userId")
        .notNull()
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
    stripeCustomerId: text("stripeCustomerId").notNull(),
    stripePriceId: text("stripePriceId").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd", {
        mode: "string",
    }).notNull(),
});