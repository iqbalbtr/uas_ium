import bcrypt from "bcrypt"
import NextAuth, { User } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/db';
import { auth, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
// import validate from "@/validations";
// import { loginUserSchema } from "@/validations/auth";

const handler = NextAuth({
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID || "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        // }),
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
        async signIn({ user, account }) {
            // if (account?.provider === "google") {
            //     await db.transaction(async (trx) => {
            //         const existingUser = await trx.query.users.findFirst({
            //             where: (tbUser, { eq }) => eq(tbUser.username, user.username as string),
            //         });

            //         if (existingUser) {
            //             await trx.update(auth)
            //                 .set({ lastLogged: new Date() })
            //                 .where(eq(auth.userId, existingUser.id));

            //             user.id = existingUser.id.toString();
            //         } else {
            //             const newUser = await trx.insert(users)
            //                 .values({
            //                     name: user.name || "user",
            //                     password: null,
            //                     email: user.email as string,
            //                 })
            //                 .returning();

            //             await trx.insert(auth)
            //                 .values({
            //                     userId: newUser[0].id,
            //                     isVerify: false,
            //                     lastLogged: new Date(),
            //                 });

            //             user.id = newUser[0].id.toString()
            //         }
            //     });

            //     return true;
            // }

            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET || "",
});

export { handler as GET, handler as POST };
