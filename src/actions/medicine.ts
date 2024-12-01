"use server"

import db from "@/db"
import { eq, sql } from "drizzle-orm"
import { getCountData } from "./helper"
import { ResponseList } from "@/model/response"
import { ObjectValidation } from "@libs/utils"
import { medicine_reminder, medicines } from "@db/schema"

export const getMedicineById = async (id: number) => {

    const isMedicine = await db.query.medicines.findFirst({
        where: (medicine, { eq }) => (eq(medicine.id, id)),
        with: {
            medicine_reminder: true
        }
    });

    if (!isMedicine)
        throw new Error("Medicine is not found")!

    return isMedicine
}

export const createMedicine = async (
    medicine: {
        active_ingredients: string,
        indication: string,
        medicine_category: string,
        medicine_code: string,
        medicine_type: string,
        name: string,
        dosage: string,
        expired: number,
        side_effect: string,
        price: number
        stock: number
    },
    reminder: {
        min: number,
        max: number
    }
) => {

    ObjectValidation(medicine)
    ObjectValidation(reminder)

    const isExist = await db.select({ count: sql`COUNT(*)` }).from(medicines).where(eq(medicines.medicine_code, medicine.medicine_code));

    if (isExist[0].count == 1)
        throw new Error("Medicine code already exist")

    // await db.transaction(async tx => {
    const id = await db.insert(medicines).values({
        ...medicine
    }).returning()

    await db.insert(medicine_reminder).values({
        max_stock: reminder.max,
        min_stock: reminder.min,
        medicine_id: id[0].id
    })
    // })

    return "Success added"
}

export const removeMedicine = async (
    id: number
) => {
    const isExist = await db.select({ count: sql`COUNT(*)` }).from(medicines).where(eq(medicines.id, id));

    if (isExist[0].count == 0)
        throw new Error("Medicine is not found")

    await db.delete(medicines).where(eq(medicines.id, id))

    return "Successfully delete"
}

export const updateMedicine = async (
    id: number,
    medicine: {
        active_ingredients: string,
        indication: string,
        medicine_category: string,
        medicine_code: string,
        medicine_type: string,
        name: string,
        dosage: string,
        expired: number,
        side_effect: string,
        price: number
    },
    reminder: {
        min: number,
        max: number
    }
) => {
    if (
        !id
    )
        throw new Error("all fields must be filled")

    ObjectValidation(medicine);

    const isExist = await db.select({ count: sql`COUNT(*)` }).from(medicines).where(eq(medicines.id, id));

    if (isExist[0].count == 0)
        throw new Error("Medicine is not found")

    await db.transaction(async tx => {
        await db.update(medicines).set({
            ...medicine,
            expired: medicine.expired,
        }).where(eq(medicines.id, id))

        await db.update(medicine_reminder).set({
            max_stock: reminder.max,
            min_stock: reminder.min,
        }).where(eq(medicine_reminder.medicine_id, id))
    })

    return "Success update medicine"
}

export const getMedicine = async (
    page: number = 1,
    limit: number = 15,
    query?: string
) => {

    const skip = (page - 1) * page

    const count = await getCountData(medicines)
    const result = await db.query.medicines.findMany({
        with: {
            medicine_reminder: true
        },
        limit,
        offset: skip,
        where({ name, medicine_code }, { or, like }) {
            return query ? or(
                like(sql`LOWER(${name})`, `%${query.toLowerCase()}%`),
                like(sql`LOWER(${medicine_code})`, `%${query.toLowerCase()}%`),
            ) : undefined
        },
        orderBy: (med, { desc }) => (desc(med.dosage))
    });

    return {
        pagging: {
            limit,
            page,
            total_page: Math.ceil(count / limit),
            total_item: count,
        },
        data: result
    }
}