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
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
            
                const existingUser = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.username, credentials.username),
                    with: {
                        role: {
                            columns: {
                                name: true
                            }
                        }
                    }
                });
            
                if (!existingUser) return null;
            
                const verify = bcrypt.compareSync(credentials.password, existingUser.password);
            
                if (!verify) return null;
            
                await db.update(auth).set({
                    last_logged: new Date(),
                }).where(eq(auth.id, existingUser.id));
            
       
                return {
                    id: existingUser.id.toString(),
                    name: existingUser.name,
                    username: existingUser.username,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    roleId: existingUser.role_id,
                    roleName: existingUser.role.name,
                    status: existingUser.status,
                } as any
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.username = user.username;
                token.phone = user.phone;
                token.roleId = user.roleId;
                token.status = user.status;
                token.roleName = user.roleName
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.phone = token.phone as string;
                session.user.roleId = token.roleId as number;
                session.user.status = token.status as string;
                session.user.roleName = token.roleName as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET || "",
});

export { handler as GET, handler as POST };
