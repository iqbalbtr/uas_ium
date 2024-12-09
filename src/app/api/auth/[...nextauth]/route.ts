import NextAuth from 'next-auth';
import { authOption } from "@libs/auth";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };