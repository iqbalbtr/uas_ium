"use server"

import db from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { ResponseList } from "@/model/response";
import { Item } from "@/app/dashboard/kasir/page";
import { getMedicineById } from "./medicine";
import { generateCode } from "@libs/utils";
import { order_medicine, orders } from "@db/schema";

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
                order_medicines: {
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

export const getOrderByCode = async (id: string) => {
    const isExist = await db
        .query.orders.findFirst({
            where: (orders, { eq }) => (eq(orders.order_code, id)),
            with: {
                order_medicines: {
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
    medicine: Item[],
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
        const isExist = await getMedicineById(m.medicineId);

        if (!isExist)
            throw new Error("Medicine is not found")

        return {
            medicine: isExist,
            payload: m
        }
    })

    const requestMedicine = await Promise.all(isValidate);

    const count = await db.select({ count: sql`COUNT(*)` }).from(orders);
    const code = generateCode(count[0].count as number)

    const totalOrder = medicine.reduce((acc, prev) => acc += (prev.price * prev.qty), 0);

    const totalTax = (order.tax / 100) * totalOrder;

    const totalDisc = (order.discount / 100) * totalOrder;

    const total = (totalOrder - totalDisc + totalTax)

    if (total < 0)
        throw new Error("Total is not valid")

    // await db.transaction(async tx => {

    const newOrder = await db.insert(orders).values({
        ...order,
        order_code: code,
        total: total
    }).returning()

    for (const med of requestMedicine) {
        await db.insert(order_medicine).values({
            order_id: newOrder[0].id,
            quantity: med.payload.qty,
            sub_total: med.payload.qty * med.medicine.price,
            price: med.medicine.price,
            medicine_id: med.medicine.id
        })
    }
    // })

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

    if ((isOrder.total - totalDisc - totalTax) < 0)
        throw new Error("Total is not valid")

    await db.update(orders).set({
        ...order,
        total: isOrder.total - totalDisc - totalTax
    })

    return "Update order successfully"
}

export const getOrder = async (
    page: number = 1,
    limit: number = 15,
    query?: string
) => {

    const skip = (page - 1) * page

    const count = await getCountData(orders);
    const result = await db.query.orders.findMany({
        with: {
            order_medicines: {
                with: {
                    medicine: true
                }
            }
        },
        limit,
        offset: skip,
        orderBy: ({order_date}, {desc}) => (desc(order_date)),
        where({order_code}, {like}) {
            return (
                like(sql`LOWER(${order_code})`, `%${query?.toLocaleLowerCase()}%`)
            )
        },
    })

    return {
        limit,
        page,
        total_item: count,
        total_page: Math.ceil(count / limit),
        data: result
    } as ResponseList<any>
}