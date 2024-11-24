"use server"

import db from "@/db"
import { medicineReminder, medicines } from "@/db/schema"
import {  eq, sql } from "drizzle-orm"
import { getCountData } from "./helper"
import { ResponseList } from "@/model/response"
import { ObjectValidation } from "@libs/utils"

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
        activeIngredients: string,
        indication: string,
        medicineCategory: string,
        medicineCode: string,
        medicineType: string,
        name: string,
        dosage: string,
        expired: number | Date,
        sideEffect: string,
        price: number
    },
    reminder: {
        min: number,
        max: number
    }
) => {

    ObjectValidation(medicine)
    ObjectValidation(reminder)

    const isExist = await db.select({ count: sql`COUNT(*)` }).from(medicines).where(eq(medicines.medicineCode, medicine.medicineCode));

    if (isExist[0].count)
        throw new Error("Medicine code already exist")

    await db.transaction(async tx => {
        const id = await tx.insert(medicines).values({
            ...medicine,
            expired: medicine.expired as Date,
        }).returning()

        await tx.insert(medicineReminder).values({
            max_stock: reminder.max,
            min_stock: reminder.min,
            medicineId: id[0].id
        })
    })

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
        activeIngredients: string,
        indication: string,
        medicineCategory: string,
        medicineCode: string,
        medicineType: string,
        name: string,
        dosage: string,
        expired: number | Date,
        sideEffect: string,
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
        await tx.update(medicines).set({
            ...medicine,
            expired: medicine.expired as Date,
        }).where(eq(medicines.id, id))

        await tx.update(medicineReminder).set({
            max_stock: reminder.max,
            min_stock: reminder.min,
        }).where(eq(medicineReminder.medicineId, id))
    })

    return "Success update medicine"
}

export const getMedicine = async (
    limit: number = 15,
    page: number,
) => {

    const skip = (page - 1) * page

    const count =  await getCountData(medicines)
    const result = await db.query.medicines.findMany({
        with: {
            medicine_reminder: true
        },
        limit,
        offset: skip,
        orderBy: (med, { desc }) => (desc(med.dosage))
    });

    return {
        limit,
        page,
        total_page: Math.ceil(count / limit),
        total_item: count,
        data: result
    } as ResponseList<any>
}