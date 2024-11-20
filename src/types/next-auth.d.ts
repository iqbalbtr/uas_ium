import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */

    interface User {
        id: string | number;
        name: string;
        username: string;
    }

    interface Session {
        user: {
            id: string | number;
            name: string;
            username: string;
        }
    }
}