"use server"

import db from "@/db"
import { apotek } from "@/db/schema"

export const updateApotek = async(
    name: string,
    alamat: string,
    email: string,
    phone: string
) => {

    await db.update(apotek).set({
        alamat,
        email,
        name,
        phone
    })

    return "Update successfully"
}

export const getApotek = async() => {
    return db.query.apotek.findFirst();
}