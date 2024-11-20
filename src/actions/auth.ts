import db from "@/db";
import { users } from "@/db/schema";
import { signIn } from "next-auth/react"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation";

export const register = async (name: string, username: string, password: string) => {
    if (!username || !password || !name)
        throw new Error("Usernam atau password diperlukan!")

    const existingUser = await db.query.users.findFirst({
        where: (user, { eq }) => (eq(user.username, username))
    })

    if(existingUser)
        throw new Error("User sudah ada!")

    const hash = await bcrypt.hash(password, 10)

    await db.insert(users).values({
        name,
        username,
        password : hash 
    })

    return "User berhasil di buat"
}

export const login = async (username: string, password: string) => {

    if (!username || !password)
        throw new Error("Usernam atau password diperlukan!")

    const res = await signIn("credentials", {
        username,
        password,
        redirect: false
    });

    if (res?.ok) {
        redirect("/dashboard")
    } else {
        throw new Error("Username atau password salah")
    }
}