"use server"

import db from "@/db";
import { medicines, orderMedicine, orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { ResponseList } from "@/model/response";

export type MedicineOrder = {
    medicineId: number;
    subTotal: number;
    quantity: number;
    price: number;
}

export const getOrderById = async (id: number) => {
    const isExist = await db
        .query.orders.findFirst({
            where: (orders, { eq }) => (eq(orders.id, id)),
            with: {
                medicines: {
                    with: {
                        medicine: true
                    }
                }
            }
        })

    if (!isExist) {
        throw new Error("Order is not found")
    }

    return isExist
}

export const createOrder = async (
    medicine: MedicineOrder[],
    order: {
        supplier: string;
        orderStatus: "cancelled" | "completed" | "pending",
        tax: number;
        discount: number
    }
) => {

    if (!medicine.length)
        throw new Error("Medicine minimum is one");

    const isValidate = medicine.map(async (m) => {
        const isExist = await db.select({ count: sql`COUNT(*)` }).from(medicines).where(eq(medicines.id, m.medicineId));

        if (isExist[0].count == 0)
            throw new Error("Medicine is not found")
    })

    await Promise.all(isValidate);

    const totalOrder = medicine.reduce((acc, prev) => acc += (prev.price * prev.quantity), 0);

    const totalTax = order.tax * totalOrder;

    const totalDisc = order.discount * totalOrder;

    if((totalOrder - totalDisc - totalTax) < 0)
        throw new Error("Total is not valid")

    await db.transaction(async tx => {

        const newOrder = await tx.insert(orders).values({
            ...order,
            total: (totalOrder - totalDisc - totalTax)
        }).returning()

        for (const med of medicine) {
            await tx.insert(orderMedicine).values({
                orderId: newOrder[0].id,
                ...med,
            })
        }
    })

    return "Order succesfully added"
}

export const removeOrder = async (
    id: number
) => {

    const count = await db
        .select({ count: sql`COUNT(*)` })
        .from(orders)
        .where(eq(orders.id, id));

    if (count[0].count == 0) {
        throw new Error("Order is not found")
    }

    await db.delete(orders).where(eq(orders.id, id))

    return "Remove order successfully"
}

export const updateOrder = async (
    id: number,
    order: {
        supplier: string;
        orderStatus: "cancelled" | "completed" | "pending",
        tax: number;
        discount: number
    }
) => {

    const isOrder = await getOrderById(id);

    const totalTax = order.tax * isOrder.tax;

    const totalDisc = order.discount * isOrder.total;

    if((isOrder.total - totalDisc - totalTax) < 0)
        throw new Error("Total is not valid")

    await db.update(orders).set({
        ...order,
        total: isOrder.total - totalDisc - totalTax
    })

    return "Update order successfully"
}

export const getOrder = async (
    limit: number = 15,
    page: number,
) => {

    const skip = (page - 1) * page

    const count = await getCountData(orders);
    const result = await db.query.orders.findMany({
        with: {
            medicines: {
                with: {
                    medicine: true
                }
            }
        },
        limit,
        offset: skip,
    })

    return {
        limit,
        page,
        total_item: count,
        total_page: Math.ceil(count / limit),
        data: result
    } as ResponseList<any>
}