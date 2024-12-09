import NextAuth from "next-auth";

declare module "next-auth" {
  // Extend default User
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    status: string;
    roleId: number;
    roleName: string;
  }

  // Extend default JWT
  interface JWT {
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      phone: string;
      status: string;
      roleId: number;
      roleName: string;
    };
  }

  // Extend default Session
  interface Session {
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      phone: string;
      status: string;
      roleId: number;
      roleName: string;
    };
  }
}
