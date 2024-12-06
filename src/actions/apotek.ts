"use server"

import db from "@/db"
import { apotek } from "@/db/schema"
import { createActivityLog } from "./activity-log"

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
    return db.query.apotek.findFirst();
}