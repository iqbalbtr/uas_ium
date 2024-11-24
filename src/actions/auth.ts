"use server"

import db from "@/db";
import { users } from "@/db/schema";
import { signIn } from "next-auth/react"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation";
import { getRoleById } from "./role";
import { eq } from "drizzle-orm";
import { ObjectValidation } from "@libs/utils";

export const getUserById = async (id: number) => {
    if (!id)
        throw new Error("id required")

    const get = await db.query.users.findFirst({
        where: (user, { eq }) => (eq(user.id, id)),
        with: {
            role: true
        }
    })

    if (!get)
        throw new Error("User is not found")

    return get
}

export const createUser = async (data: {
    name: string,
    username: string,
    password: string,
    email: string,
    phone: string,
    role: number
}) => {

    ObjectValidation(data);

    const existingUser = await db.query.users.findFirst({
        where: (user, { eq }) => (eq(user.username, data.username))
    })

    if (existingUser)
        throw new Error("Username already exist!")

    await getRoleById(data.role);

    const hash = await bcrypt.hash(data.password, 10)

    await db.insert(users).values({
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        roleId: data.role,
        password: hash
    })

    return "Created user successfully"
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

export const getUser = async (
    page: number = 1,
    limit: number = 15
) => {

    const skip = (page - 1) * limit;

    const result = await db.query.users.findMany({
        limit,
        offset: skip,
        with: {
            role: true
        },
        columns: {
            id: true,
            username: true,
            email: true,
            name: true,
            phone: true,
            status: true,
        }
    })

    return result
}

export const updateUser = async (
    id: number,
    email: string,
    phone: string
) => {

    if (
        !id ||
        !email ||
        !phone
    )
        throw new Error("All field must be filled1")

    await getUserById(id)

    await db.update(users).set({
        email,
        phone
    }).where(eq(users.id, id))

    return "Update user seuccessfully"
}