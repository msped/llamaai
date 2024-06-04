import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GitHub from "next-auth/providers/github"
import { db } from '@/db/index';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    basePath: '/api/auth',
    session: {
        jwt: true,
    },
    providers: [
        GitHub({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name,
                    username: profile.login,
                    image: profile.avatar_url,
                    email: profile.email,
                    emailVerified: profile.emailVerified,
                }
            },
        }),
    ],
    callbacks: {
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl
            if (pathname === "/middleware-example") return !!auth
            return true
        },
        async jwt({ token }) {
            const dbUser = await db.select().from(users).where(eq(users.email, token.email))
            if (!dbUser) {
                throw new Error("User not found")
            }

            return {
                id: dbUser.id,
                username: dbUser.username,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
            }
            return session
        },
    },
    debug: process.env.NODE_ENV !== "production" ? true : false,
});