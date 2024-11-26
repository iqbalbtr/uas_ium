"use server"
import db from "@/db"
import { getMedicineById } from "./medicine";
import { medicines, transactionItem, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ResponseList } from "@/model/response";
import { ObjectValidation } from "@/lib/utils";

export type TransactionItem = {
    qty: number;
    medicineId: number;
}

export const getTransactionById = async (id: number) => {
    const get = await db.query.transactions.findFirst({
        where: (trans, { eq }) => (eq(trans.id, id)),
        with: {
            items: {
                with: {
                    medicine: true
                }
            },
            user: true
        }
    })

    if (!get)
        throw new Error("Transaction is not found")

    return get
}


export const createTransaction = async (
    userId: number,
    transaction: {
        userId: number,
        buyer: string,
        paymentMethod: "cash" | "installment",
        paymentExpired: number | Date,
        transactionStatus: "pending" | "completed" | "cancelled",
        discount: number;
        tax: number;
        expired?: number | Date;
    },
    items: TransactionItem[]
) => {

    if(!userId)
        throw new Error("Id user is requierd")

    ObjectValidation(transaction)

    if (transaction.paymentMethod == "installment" && !transaction.expired)
        throw new Error("Expired value required")

    if (transaction.expired && new Date(transaction.expired).getTime() - new Date().getTime() < 0)
        throw new Error("Expired not valid")

    if (items.length == 0)
        throw new Error("Item at least one item")


    const isItem = items.map(async (it) => {
        const isExist = await getMedicineById(it.medicineId)

        if (!isExist)
            throw new Error("Medicine is not found")

        if (isExist.stock - it.qty < 0) {
            throw new Error(`${isExist.name} stock is not enough`)
        }

        return {
            medicineId: isExist.id,
            subTotal: (isExist.price * it.qty),
            qty: it.qty,
            stock: isExist.stock - it.qty
        }
    })

    const allItem = await Promise.all(isItem);

    const total = allItem.reduce((acc, prev) => acc += prev.subTotal, 0);
    const disc = total * transaction.discount;
    const tax = total * transaction.tax;

    const code = await db.select({count: sql`COUNT(*)`}).from(transactions)

    if ((total - disc - tax) < 0)
        throw new Error("Total transaction is not valid")

    await db.transaction(async tx => {

        const trans = await tx.insert(transactions).values({
            buyer: transaction.buyer,
            discount: transaction.discount,
            paymentMethod: transaction.paymentMethod,
            tax: transaction.tax,
            transactionStatus: transaction.transactionStatus,
            total: total - disc - tax,
            userId: userId,
            transactionDate: new Date(),
            paymentExpired: transaction.expired ? new Date(transaction.expired) : null,
            codeTransaction: "TS" + String(code[0].count as number),
        }).returning()

        for (const item of allItem) {

            await tx.update(medicines).set({
                stock: item.stock
            })

            await tx.insert(transactionItem).values({
                quantity: item.qty,
                subTotal: item.subTotal,
                transactionId: trans[0].id,
                medicineId: item.medicineId
            })
        }
    })

    return "transaction successfully"
}

export const removeTransaction = async (
    id: number
) => {

    await getTransactionById(id)

    await db.delete(transactions).where(eq(transactions.id, id))

    return "Delete successfully"
}

export const updateTransaction = async (
    id: number,
    transaction: {
        buyer: string,
        paymentMethod: "cash" | "installment",
        paymentExpired: number | Date,
        transactionStatus: "pending" | "completed" | "cancelled",
        discount: number;
        tax: number;
        expired?: number | Date;
    },
) => {

    ObjectValidation(transaction)

    if (transaction.paymentMethod == "installment" && !transaction.expired)
        throw new Error("Expired value required")

    if (transaction.expired && new Date(transaction.expired).getTime() - new Date().getTime() < 0)
        throw new Error("Expired not valid")

    const exisitngTransaction = await getTransactionById(id)

    const total = exisitngTransaction.items.reduce((acc, prev) => acc += prev.subTotal, 0);
    const disc = total * transaction.discount;
    const tax = total * transaction.tax;

    if ((total - disc - tax) < 0)
        throw new Error("Total transaction is not valid")

    await db.update(transactions).set({
        buyer: transaction.buyer,
        discount: transaction.discount,
        tax: transaction.tax,
        paymentMethod: transaction.paymentMethod,
        transactionStatus: transaction.transactionStatus,
        paymentExpired: transaction.expired ? new Date(transaction.expired) : null,
        total: total - disc - tax
    })

}

export const getTransaction = async (
    page: number = 1,
    limit: number = 15
) => {

    const skip = (page - 1) * limit;

    const totalItem = await db.select({ count: sql`COUNT(*)` }).from(transactions);


    const result = await db.query.transactions.findMany({
        limit,
        offset: skip,
        with: {
            items: {
                with: {
                    medicine: true
                }
            },
            user: true
        }
    })

    return {
        limit,
        page,
        total_item: totalItem[0].count,
        total_page: Math.ceil(totalItem[0].count as number / limit),
        data: result
    } as ResponseList<any>
}