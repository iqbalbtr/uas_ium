"use server"

import db from "@/db";
import { getMedicineById } from "./medicine";
import { prescriptionMedicine, prescriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCountData } from "./helper";
import { ObjectValidation } from "@libs/utils";

export type MedicinePresciption = {
    medicineId: number;
    qty: number;
    notes: string;
}

export const getPresciptionById = async (id: number) => {

    const get = await db.query.prescriptions.findFirst({
        where: (pres, { eq }) => (eq(pres.id, id)),
        with: {
            medicines: {
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
        presciptionDate: Date | number;
        patient: string;
        doctor: string;
        description: string;
        intructions: string;
    },
    medicnes: MedicinePresciption[]
) => {
    
    ObjectValidation(presciption)

    if (medicnes.length == 0)
        throw new Error("Medicine at least one item")

    const isItem = medicnes.map(async (med) => {
        const existing = await getMedicineById(med.medicineId);
        return existing;
    })

    await Promise.all(isItem);

    await db.transaction(async tx => {
        const newPresciption = await tx.insert(prescriptions).values({
            name: presciption.name,
            prescriptionDate: new Date(presciption.presciptionDate),
            description: presciption.description,
            doctorName: presciption.doctor,
            instructions: presciption.intructions,
            patientName: presciption.patient
        }).returning()

        for (const item of medicnes) {
            await tx.insert(prescriptionMedicine).values({
                prescriptionId: newPresciption[0].id,
                quantity: item.qty,
                notes: item.notes,
                medicineId: item.medicineId
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
        patient: string;
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
            prescriptionDate: new Date(presciption.presciptionDate),
            description: presciption.description,
            doctorName: presciption.doctor,
            instructions: presciption.intructions,
            patientName: presciption.patient
        }).where(eq(prescriptions.id, id))

        await tx.delete(prescriptionMedicine).where(eq(prescriptionMedicine.prescriptionId, id))

        for (const item of medicnes) {
            await tx.insert(prescriptionMedicine).values({
                prescriptionId: id,
                quantity: item.qty,
                notes: item.notes,
                medicineId: item.medicineId
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
            medicines: {
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