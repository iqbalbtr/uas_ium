"use sever"
import db from "@/db";
import { getOrderByCode, getOrderById, getOrderMedicineById } from "./order";
import { medicines, order_medicine, orders, receipt_medicine, receipts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { generateCode } from "@libs/utils";
import { ItemReceived } from "@components/fragments/receipt/CreateReceiptForm";
import { UpdateItemReceived } from "@components/fragments/receipt/UpdateReceiptForm";
import {  getMedicineById } from "./medicine";

export const getReceiptById = async (id: number) => {
    const getReceipt = await db.query.receipts.findFirst({
        where: (receipt, { eq }) => (eq(receipt.id, id)),
        with: {
            receipt_medicines: {
                with: {
                    order_medicine: true
                }
            },
            order: true
        }
    })

    if (!getReceipt)
        throw new Error("Receipt is not found")

    return getReceipt;
}
export const getReceiptMedicineById = async (id: number) => {
    const getReceipt = await db.query.receipt_medicine.findFirst({
        where: (receipt, { eq }) => (eq(receipt.id, id))
    })

    if (!getReceipt)
        throw new Error("Receipt is not found")

    return getReceipt;
}

export const createReceipt = async (
    order_code: string,
    delivery_name: string,
    receipt_status: "accepted" | "pending" | "rejected",
    items: ItemReceived[],
) => {

    if (!order_code || !delivery_name || !order_code)
        throw new Error("All field must be filled")

    const orderExist = await getOrderByCode(order_code);

    const countReceipt = await db.select({ count: sql`COUNT(*)` }).from(receipts)

    const code = generateCode(countReceipt[0].count as number)

    const total_received = items.reduce((acc, pv) => acc += pv.received, 0)

    if (!orderExist)
        throw new Error("Order is not found");

    if (orderExist.total_item == orderExist.total_item_received)
        throw new Error("All item already received")


    const isItem = await Promise.all(items.map(async fo => {
        const orderMedicine = await getOrderMedicineById(fo.order_medicine_id)

        if (orderMedicine.received_total + fo.received > orderMedicine.quantity)
            throw new Error(`Quantity item ${orderMedicine.medicine?.name} is exceeds the limit`)

        return {
            ...orderMedicine,
            payload: fo
        }
    }))

    const request_status = total_received + orderExist.total_item_received == orderExist.total_item ? "full" : "partial"

    await db.transaction(async tx => {
        const receipt = await tx.insert(receipts).values({
            order_id: orderExist.id,
            receipt_status,
            delivery_name: delivery_name,
            total_received_item: total_received,
            receipt_code: code
        }).returning()

        await tx.update(orders).set({
            total_item_received: orderExist.total_item_received + total_received,
            request_status,
        }).where(eq(orders.id, orderExist.id))

        await Promise.all(isItem.map(async fo => {
            await tx.update(order_medicine).set({
                received_total: fo.received_total + fo.payload.received
            }).where(eq(order_medicine.id, fo.id))

            await tx.insert(receipt_medicine).values({
                receipt_id: receipt[0].id,
                received: fo.payload.received,
                order_medicine_id: fo.id
            })

            await tx.update(medicines).set({
                stock: fo.medicine?.stock! + fo.payload.received
            }).where(eq(medicines.id, fo.medicine_id!))
        }))
    })

    return "Receipts created successfully"
}


export const removeReceipt = async (
    id: number
) => {

    if (!id)
        throw new Error("Id value required");

    const isExisting = await getReceiptById(id);


    await db.transaction(async tx => {
        await Promise.all(isExisting.receipt_medicines.map(async fo => {
            const isMedicine = await getMedicineById(fo.order_medicine?.medicine_id!)

            if ((isMedicine.stock - fo.received) < 0)
                throw new Error("Item stock is not valid")


            await tx.update(order_medicine).set({
                received_total: fo.order_medicine?.received_total! - fo.received,
            }).where(eq(order_medicine.id, fo.order_medicine_id!))

            await tx.update(medicines).set({
                stock: isMedicine.stock - fo.received
            }).where(eq(medicines.id, isMedicine.id))
        }))

        const totalReceived = isExisting.order.total_item_received - isExisting.receipt_medicines.reduce((acc, pv) => acc += pv.received, 0)

        await tx.update(orders).set({
            request_status: totalReceived == 0 ? "not_yet" : "partial",
            total_item_received: totalReceived
        }).where(eq(orders.id, isExisting.order_id))

        await tx.delete(receipts).where(eq(receipts.id, id))
    })

    return "Delete receipt successfully"
}

export const updateReceipt = async (
    id: number,
    receipt: {
        order_id: number;
        receipt_status: "pending" | "rejected" | "accepted",
        delivery_name: string;
    },
    items: UpdateItemReceived[]
) => {

    const isExisting = await getReceiptById(id);

    const orderExist = await getOrderById(receipt.order_id);

    const isItem = await Promise.all(items.map(async fo => {
        const orderMedicine = await getOrderMedicineById(fo.order_medicine_id)
        const isExist = await getReceiptMedicineById(fo.receipt_medicine_id!);

        const current_order_total_item = orderMedicine.received_total - isExist.received

        if (current_order_total_item + fo.received > orderMedicine.quantity)
            throw new Error(`Quantity item ${orderMedicine.medicine?.name} is exceeds the limit`)

        if ((orderMedicine.medicine?.stock! - current_order_total_item + fo.received) < 0)
            throw new Error("Medicine stock is not valid")

        return {
            ...orderMedicine,
            medicine: {
                ...orderMedicine.medicine,
                stock: orderMedicine.medicine?.stock! - current_order_total_item
            },
            payload: {
                ...fo,
                current_order_total_item
            }
        }
    }))

    const total_received = items.reduce((acc, pv) => acc += pv.received, 0)

    const current_order_total_item = orderExist.total_item_received - isExisting.total_received_item

    const request_status = current_order_total_item + total_received == 0 ? "not_yet" : current_order_total_item + total_received == orderExist.total_item ? "full" : "partial"

    await db.transaction(async tx => {

        await tx.update(orders).set({
            total_item_received: current_order_total_item + total_received,
            request_status,
        }).where(eq(orders.id, orderExist.id))

        await tx.update(receipts).set({
            receipt_status: receipt.receipt_status,
            delivery_name: receipt.delivery_name,
            total_received_item: total_received
        }).where(eq(receipts.id, isExisting.id))

        await Promise.all(isItem.map(async fo => {
            await tx.update(order_medicine).set({
                received_total: fo.payload.current_order_total_item + fo.payload.received
            }).where(eq(order_medicine.id, fo.payload.order_medicine_id))

            await tx.update(receipt_medicine).set({
                received: fo.payload.received,
            }).where(eq(receipt_medicine.id, fo.payload.receipt_medicine_id!))

            await tx.update(medicines).set({
                stock: fo.medicine?.stock! + fo.payload.received
            }).where(eq(medicines.id, fo.medicine_id!))
        }))
    })

    return "Update recipe successfully"
}

export const getReceipt = async (
    page: number = 1,
    limit: number = 15
) => {

    const skip = (page - 1) * limit
    const count = (await db.select({count: sql`COUNT(*)`}).from(orders))[0].count as number

    const res = await db.query.receipts.findMany({
        limit,
        offset: skip,
        with: {
            receipt_medicines: {
                with: {
                    order_medicine: {
                        with: {
                            medicine: true
                        }
                    }
                }
            },
            order: true
        },
        orderBy(fields, operators) {
            return operators.desc(fields.id)
        },
    })

    return {
        pagging: {
            limit,
            page,
            total_item: count,
            total_page: Math.ceil(count / limit),
        },
        data: res
    }
}

export const getAllReceiptByIdOrder = async(id: number) => {

    const get = await db.query.receipts.findMany({
        where: (rec, {eq}) => (eq(rec.order_id, id))
    })

    return get
}
export const getAllReceiptItemByIdOrder = async(id: number) => {

    const get = await db.query.receipt_medicine.findMany({
        where: (rec, {eq}) => (eq(rec.order_medicine_id, id)),
        with: {
            order_medicine: {
                with: {
                    medicine: {
                        columns: {
                            name: true,
                            medicine_code: true
                        }
                    }
                },
                columns: {
                    quantity: true
                }
            }
        }
    })

    return get
}