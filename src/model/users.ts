import { Role } from "./roles";

export interface User {
    id: number;
    name: string;
    username: string;
    phone: string;
    email: string;
    password?: string;
    status: string;
    role?: Role;
    auth?: Auth;
  }
  
  export interface Auth {
    id: number;
    user_id: number;
    token?: string;
    last_logged?: Date;
  }