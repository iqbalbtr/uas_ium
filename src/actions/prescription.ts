"use server"

import db from "@/db";
import { getMedicineById } from "./medicine";
import { prescription_medicine, prescriptions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { ObjectValidation } from "@/lib/utils";

export type MedicinePresciption = {
    medicineId: number;
    qty: number;
    notes: string;
}

export const getPresciptionById = async (id: number) => {

    const get = await db.query.prescriptions.findFirst({
        where: (pres, { eq }) => (eq(pres.id, id)),
        with: {
            prescription_medicines: {
                with: {
                    medicine: true
                }
            }
        }
    })

    if (!get)
        throw new Error("Presciption is not found")

    return get;
}

export const createPresciption = async (
    presciption: {
        name: string;
        doctor: string;
        description: string;
        intructions: string;
        discount: number;
        tax: number;
        fee: number;
    },
    medicines: MedicinePresciption[]
) => {
    
    ObjectValidation(presciption)

    if (medicines.length == 0)
        throw new Error("Medicine at least one item")

    const isItem = medicines.map(async (med) => {
        const existing = await getMedicineById(med.medicineId);
        return existing;
    })

    const allMediicine = await Promise.all(isItem);

    const code = await db.select({count: sql`COUNT(*)`}).from(prescriptions);

    const total = allMediicine.reduce((acc, pv) => acc += pv.price, 0)
    const tax = presciption.tax * total;
    const discount = (presciption.discount / 100) * total;

    await db.transaction(async tx => {
        const newPresciption = await tx.insert(prescriptions).values({
            code_prescription: "PR" + String(code[0].count as number),
            name: presciption.name,
            prescription_date: new Date(),
            description: presciption.description,
            doctor_name: presciption.doctor,
            instructions: presciption.intructions,
            price: total - discount + tax + presciption.fee,
            discount: presciption.discount,
            fee: presciption.fee,
            tax: presciption.tax,
        }).returning()

        for (const item of medicines) {
            await tx.insert(prescription_medicine).values({
                prescription_id: newPresciption[0].id,
                quantity: item.qty,
                notes: item.notes,
                medicine_id: item.medicineId
            })
        }
    })

    return "Create presciption successfully"
}

export const removePresciption = async (
    id: number
) => {

    await getPresciptionById(id);

    await db.delete(prescriptions).where(eq(prescriptions.id, id))

    return "Remove presciption successfully"
}

export const updatePresciption = async (
    id: number,
    presciption: {
        name: string;
        presciptionDate: Date | number;
        doctor: string;
        description: string;
        intructions: string;
    },
    medicnes: MedicinePresciption[]
) => {

    if(!id)
        throw new Error("Id is requierd")

    ObjectValidation(presciption)

    if (medicnes.length == 0)
        throw new Error("Medicine at least one item")

    const isItem = medicnes.map(async (med) => {
        const existing = await getMedicineById(med.medicineId);
        return existing;
    })

    await Promise.all(isItem);

    await db.transaction(async tx => {
        await tx.update(prescriptions).set({
            name: presciption.name,
            prescription_date: new Date(presciption.presciptionDate),
            description: presciption.description,
            doctor_name: presciption.doctor,
            instructions: presciption.intructions,
        }).where(eq(prescriptions.id, id))

        await tx.delete(prescription_medicine).where(eq(prescription_medicine.prescription_id, id))

        for (const item of medicnes) {
            await tx.insert(prescription_medicine).values({
                prescription_id: id,
                quantity: item.qty,
                notes: item.notes,
                medicine_id: item.medicineId
            })
        }
    })

    return "Update presciption successfully"
}

export const getPresciption = async (
    page: number = 1,
    limit: number = 15
) => {
    const skip = (page - 1) * limit;

    const count = await getCountData(prescriptions)

    const result = await db.query.prescriptions.findMany({
        limit,
        offset: skip,
        with: {
            prescription_medicines: {
                with: {
                    medicine: true
                }
            }
        }
    })

    return {
        limit,
        page,
        total_item: count,
        total_page: Math.ceil(count / limit),
        data: result
    }
}