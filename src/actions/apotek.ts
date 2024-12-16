"use server"

import db from "@/db"
import { apotek } from "@/db/schema"
import { createActivityLog } from "./activity-log"
import { eq } from "drizzle-orm"

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
    
    await createActivityLog((user) => ({
        action_name: "Mengubah apotek",
        action_type: "update",
        description: `${user.name} mengubah informasi apotek`,
        title: "Ubah apotel"
    }))
    
    return "Update successfully"
}

export const getApotek = async() => {
    return (await db.select().from(apotek).where(eq(apotek.id, 1)))[0]
}