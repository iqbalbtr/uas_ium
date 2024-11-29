import db from "@/db";
import { getOrderByCode, getOrderById } from "./order";
import { medicines, receipts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { generateCode } from "@libs/utils";

export const getReceiptById = async (id: number) => {
    const getReceipt = await db.query.receipts.findFirst({
        where: (receipt, { eq }) => (eq(receipt.id, id))
    })

    if (!getReceipt)
        throw new Error("Receipt is not found")

    return getReceipt;
}

export const createReceipt = async (
    payment_method: "cash" | "installment",
    receipt_status: "pending" | "rejected" | "accepted",
    request_status: "full" | "partial",
    order_code: string,
    payment_expired?: number | Date,
) => {

    if (!payment_method || !receipt_status || !order_code)
        throw new Error("All field must be filled")

    if (payment_method == "installment" && !payment_expired) {
        throw new Error("Payment expred required");
    }
    if (payment_method == "installment" &&  payment_expired && new Date(payment_expired).getTime() - new Date().getTime() < 0)
        throw new Error("Date is not valid")


    const orderExist = await getOrderByCode(order_code);

    const countReceipt = await db.select({count: sql`COUNT(*)`}).from(receipts)

    const code = generateCode(countReceipt[0].count as number)

    if (!orderExist)
        throw new Error("Order is not found");

    const expired = payment_expired ? new Date(payment_expired) : new Date()

    // await db.transaction(async tx => {
        await db.insert(receipts).values({
            order_id: orderExist.id,
            payment_method,
            receipt_status,
            payment_expired: expired,
            request_status,
            receipt_code: code
        })

        const updateStock = orderExist.order_medicines.map(async (med) => {
            return db.update(medicines).set({
                stock: med.medicine?.stock! + med.quantity,
            })
        })

        await Promise.all(updateStock)
    // })
    return "Receipts created successfully"
}


export const removeReceipt = async (
    id: number
) => {

    if (!id)
        throw new Error("Id value required");

    const isExisting = await getReceiptById(id);

    await db.delete(receipts).where(eq(receipts.id, isExisting.id))

    return "Delete receipt successfully"
}

export const updateReceipt = async (
    id: number,
    payment_method: "cash" | "installment",
    receipt_status: "pending" | "rejected" | "accepted",
    request_status: "full" | "partial",
) => {

    const isExisting = await getReceiptById(id);

    await db.update(receipts).set({
        payment_method,
        receipt_status,
        request_status,
    }).where(eq(receipts.id, isExisting.id))

    return "Update recipe successfully"
}

export const getReceipt = async (
    page: number = 1,
    limit: number = 15
) => {

    const skip = (page - 1) * limit
    const count = await getCountData(receipts)

    const res = await db.query.receipts.findMany({
        limit,
        offset: skip,
    })

    return {
        limit,
        page,
        total_item: count,
        total_page: Math.ceil(count / limit),
        data: res
    }
}