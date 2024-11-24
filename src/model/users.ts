export interface User {
    id: number;
    name: string;
    username: string;
    phone?: string;
    email?: string;
    status: string; 
    role: Role;
}

export interface Auth {
    id: number;
    userId: number;
    token?: string;
    lastLogged?: Date;
}