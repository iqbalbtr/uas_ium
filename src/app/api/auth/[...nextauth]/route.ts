import bcrypt from "bcrypt"
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/db';
import { auth } from '@/db/schema';
import { eq } from 'drizzle-orm';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "username" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                
                const existingUser = await db.query.users.findFirst({
                    where: (user, { eq }) => (eq(user.username, credentials?.username!))
                })

                if (!existingUser)
                    return null

                const verify = bcrypt.compareSync(credentials?.password!, existingUser.password!)

                if (!verify)
                    return null

                await db.update(auth).set({
                    lastLogged: new Date(),
                }).where(eq(auth.id, existingUser.id))

                
                return {
                    id: existingUser.id.toString(),
                    name: existingUser.name,
                    username: existingUser.username,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email as string;
                token.name = user.name as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name!;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET || "",
});

export { handler as GET, handler as POST };
