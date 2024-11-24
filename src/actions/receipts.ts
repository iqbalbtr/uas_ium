import db from "@/db";
import { getOrderById } from "./order";
import { medicines, receipts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCountData } from "./helper";

export const getReceiptById = async (id: number) => {
    const getReceipt = await db.query.receipts.findFirst({
        where: (receipt, { eq }) => (eq(receipt.id, id))
    })

    if (!getReceipt)
        throw new Error("Receipt is not found")

    return getReceipt;
}

export const createReceipt = async (
    paymentMethod: "cash" | "installment",
    receiptStatus: "pending" | "rejected" | "accepted",
    requestStatus: "full" | "partial",
    orderId: number,
    paymentExpired?: number | Date,
) => {

    if (!paymentMethod || !receiptStatus || !orderId)
        throw new Error("All field must be filled")

    if (paymentMethod == "installment" && !paymentExpired) {
        throw new Error("Payment expred required");
    }

    if (paymentExpired && new Date(paymentExpired).getTime() - new Date().getTime() < 0)
        throw new Error("Date is not valid")

    const orderExist = await getOrderById(orderId);

    if (!orderExist)
        throw new Error("Order is not found");

    const expired = paymentExpired ? new Date(paymentExpired) : new Date()

    await db.transaction(async tx => {
        await tx.insert(receipts).values({
            orderId,
            paymentExpired: expired,
            paymentMethod,
            receiptStatus,
            requestStatus
        })

        const updateStock = orderExist.medicines.map(async (med) => {
            return tx.update(medicines).set({
                stock: (med.medicine?.stock ?? 0) + med.quantity,
                expired: expired
            })
        })

        await Promise.all(updateStock)
    })
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
    paymentMethod: "cash" | "installment",
    receiptStatus: "pending" | "rejected" | "accepted",
    requestStatus: "full" | "partial",
) => {

    const isExisting = await getReceiptById(id);

    await db.update(receipts).set({
        paymentMethod,
        receiptStatus,
        requestStatus,
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