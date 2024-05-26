import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GitHub from "next-auth/providers/github"
import { db } from '@/db/index';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    basePath: '/api/auth',
    providers: [
        GitHub({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name,
                    username: profile.login,
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
        jwt({ token, trigger, session, account }) {
            if (trigger === "update") token.name = session.user.name
            return token
        },
        async session({ session, token, user }) {
            if (token?.accessToken) {
                session.accessToken = token.accessToken
                session.user = {
                    id: token.id,
                    ...user
                }
            }
            return session
        },
    },
    debug: process.env.NODE_ENV !== "production" ? true : false,
});