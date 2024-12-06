"use server"

import db from "@/db";
import { getMedicineById } from "./medicine";
import { medicines, prescription_medicine, prescriptions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { ObjectValidation } from "@/lib/utils";
import { ItemPresciption } from "@components/fragments/presception/PresciptionMedicineTable";

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
export const getPresciptionCode = async (id: string) => {

    try {
        const get = await db.query.prescriptions.findFirst({
            where: (pres, { eq }) => (eq(pres.code_prescription, id)),
        })

        return get;
    } catch (error) {
        return undefined
    }
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
        code_presciption: string;
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

    const code = await getPresciptionCode(presciption.code_presciption)

    if (code)
        throw new Error("Code already exist")

    const total = allMediicine.reduce((acc, pv) => acc += pv.selling_price, 0)
    const tax = presciption.tax * total;
    const discount = (presciption.discount / 100) * total;

    await db.transaction(async tx => {
        const newPresciption = await tx.insert(prescriptions).values({
            code_prescription: presciption.code_presciption,
            name: presciption.name,
            prescription_date: new Date(),
            description: presciption.description,
            doctor_name: presciption.doctor,
            instructions: presciption.intructions,
            price: total - discount + tax + presciption.fee,
            discount: presciption.discount,
            fee: presciption.fee,
            tax: presciption.tax,
            stock: 0
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

    const isExist = await getPresciptionById(id);

    await db.transaction(async tx => {
        for (const fo of isExist.prescription_medicines) {

            if (!fo.medicine)
                continue;

            await tx.update(medicines).set({
                stock: (fo.medicine?.stock ?? 0) + (fo.quantity * isExist.stock)
            }).where(eq(medicines.id, fo.medicine_id!))
        }
        await tx.delete(prescriptions).where(eq(prescriptions.id, id))
    })


    return "Remove presciption successfully"
}

export const updatePresciption = async (
    id: number,
    presciption: {
        name: string;
        code_presciption: string;
        discount: number;
        fee: number;
        tax: number;
        doctor: string;
        description: string;
        intructions: string;
    },
    medicnes: ItemPresciption[]
) => {

    if (!id)
        throw new Error("Id is requierd")

    ObjectValidation(presciption)

    if (medicnes.length == 0)
        throw new Error("Medicine at least one item")

    const isItem = medicnes.map(async (med) => {
        const existing = await getMedicineById(med.medicineId);
        return existing;
    })

    const allMediicine = await Promise.all(isItem);

    const total = allMediicine.reduce((acc, pv) => acc += pv.selling_price, 0)
    const tax = presciption.tax * total;
    const discount = (presciption.discount / 100) * total;

    if (total + tax - discount < 0) {
        throw new Error("Price must more than equal 0")
    }

    await db.transaction(async tx => {
        await tx.update(prescriptions).set({
            name: presciption.name,
            prescription_date: new Date(),
            description: presciption.description,
            doctor_name: presciption.doctor,
            instructions: presciption.intructions,
            code_prescription: presciption.code_presciption,
            discount: presciption.discount,
            fee: presciption.fee,
            price: total + tax - discount,
            tax: presciption.tax
        }).where(eq(prescriptions.id, id))

        await presciptionMutation(id, 0)

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
        pagging: {
            limit,
            page,
            total_item: count,
            total_page: Math.ceil(count / limit),
        },
        data: result
    }
}
export const presciptionMutation = async (id: number, qty: number) => {
    const isExist = await getPresciptionById(id);
    if (!isExist) {
        throw new Error("Prescription not found");
    }

    if (qty < 0) {
        throw new Error("Quantity must be greater than 0");
    }

    const isPlus = isExist.stock > qty ? "plus" : "minus";
    const totalQty = Math.abs(isExist.stock - qty);

    await db.transaction(async (tx) => {
        for (const fo of isExist.prescription_medicines) {

            if (!fo.medicine) {
                throw new Error(`Medicine data for prescription item ${fo.id} is missing`);
            }

            let total = 0;

            switch (isPlus) {
                case "plus":
                    total = fo.medicine.stock + (fo.quantity * totalQty);
                    break;
                case "minus":
                    total = fo.medicine.stock - (fo.quantity * totalQty);
                    break;
            }

            if (total < 0) {
                throw new Error(`Total stock of ${fo.medicine.name} is less than zero`);
            }

            await tx.update(medicines)
                .set({ stock: qty == 0 ? (fo.medicine.stock + (fo.quantity * isExist.stock)) : total })
                .where(eq(medicines.id, fo.medicine_id!));
        }

        await tx.update(prescriptions)
            .set({ stock: qty })
            .where(eq(prescriptions.id, id));
    });

    return "Update successfully";
};
