"use server"

import db from "@/db"
import { getMedicineById } from "./medicine";
import { medicines, prescriptions, shift, transaction_item, transactions } from "@/db/schema";
import { and, eq, like, sql } from "drizzle-orm";
import type { ResponseList } from "@/model/response";
import { ObjectValidation } from "@/lib/utils";
import { getLatestShift } from "./shift";
import { Item } from "@/app/dashboard/kasir/page";
import { getPresciptionById } from "./prescription";

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

export const getTransactionByCode = async (id: string) => {
    const get = await db.query.transactions.findFirst({
        where: (trans, { eq }) => (eq(trans.code_transaction, id)),
        with: {
            items: {
                with: {
                    medicine: true,
                    prescription: true
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
        buyer: string,
        payment_method: "cash" | "installment",
        payment_expired?: Date,
        discount: number;
        tax: number;
    },
    items: Item[],
    cash?: number
) => {

    if (!userId)
        throw new Error("Id user is requierd")

    ObjectValidation(transaction)

    if (transaction.payment_method == "installment" && !transaction.payment_expired)
        throw new Error("Expired value required")

    if (
        transaction.payment_method === "installment" &&
        transaction.payment_expired &&
        transaction.payment_expired.getTime() < Date.now()
    ) {
        throw new Error("Expired not valid");
    }

    if (items.length == 0)
        throw new Error("Item at least one item")

    const isItem = items.map(async (it) => {
        if (it.type == "medicine") {
            const isExist = await getMedicineById(it.id)

            if (!isExist)
                throw new Error("Medicine is not found")

            if (isExist.stock - it.qty < 0) {
                throw new Error(`${isExist.name} stock is not enough`)
            }

            return {
                id: isExist.id,
                subTotal: (isExist.selling_price * it.qty),
                diffenceTotal: (isExist.selling_price * it.qty) - (isExist.purchase_price * it.qty),
                qty: it.qty,
                stock: isExist.stock - it.qty,
                type: it.type
            }
        } else {
            const isExist = await getPresciptionById(it.id)

            if (!isExist)
                throw new Error("Preciption is not found")

            if (isExist.stock - it.qty < 0) {
                throw new Error(`${isExist.name} stock is not enough`)
            }

            return {
                id: isExist.id,
                subTotal: (isExist.price * it.qty),
                diffenceTotal: (isExist.price * it.qty) - (isExist.price * it.qty),
                qty: it.qty,
                stock: isExist.stock - it.qty,
                type: it.type
            }
        }
    })

    const allItem = await Promise.all(isItem);

    const total = allItem.reduce((acc, prev) => acc += prev.subTotal, 0);
    const disc = total * (transaction.discount / 100);
    const tax = total * (transaction.tax / 100);


    if ((total - disc + tax) <= 0) {
        throw new Error("Total transaction is not valid");
    }

    const currentShift = await getLatestShift()

    if (!currentShift || currentShift.status_shift !== "pending")
        throw new Error("Shift is not found")


    if (transaction.payment_method == "cash") {

        if (!cash)
            throw new Error("Cash required")

        if (cash < (total - disc + tax))
            throw new Error("Cash is not enough")
    }

    const code = await db.select({ count: sql`COUNT(*)` }).from(transactions)

    const payment_status = transaction.payment_method == "cash" ? "completed" : "pending"

    await db.transaction(async tx => {
        const trans = await tx.insert(transactions).values({
            buyer: transaction.buyer,
            discount: transaction.discount,
            payment_method: transaction.payment_method,
            tax: transaction.tax,
            transaction_status: transaction.payment_method == "cash" ? "completed" : "pending",
            total: total - disc + tax,
            user_id: userId,
            transaction_date: new Date(),
            payment_status,
            payment_expired: transaction.payment_expired ? new Date(transaction.payment_expired) : null,
            code_transaction: "TS" + String(code[0].count as number),
            payment_date: transaction.payment_method == "cash" ? new Date() : null
        }).returning()

        for (const item of allItem) {

            if (item.type == "medicine") {
                await tx.update(medicines).set({
                    stock: item.stock
                }).where(eq(medicines.id, item.id))

                await tx.insert(transaction_item).values({
                    quantity: item.qty,
                    sub_total: item.subTotal,
                    transaction_id: trans[0].id,
                    medicine_id: item.id,
                    difference_sub_total: item.diffenceTotal
                })
            } else {
                await tx.update(prescriptions).set({
                    stock: item.stock
                }).where(eq(prescriptions.id, item.id))
    
                await tx.insert(transaction_item).values({
                    quantity: item.qty,
                    sub_total: item.subTotal,
                    transaction_id: trans[0].id,
                    presciption_id: item.id,
                    difference_sub_total: item.diffenceTotal
                })
            }
        }

    })

    return "TS" + String(code[0].count as number)
}

export const removeTransaction = async (
    id: number
) => {

    await getTransactionById(id)

    await db.delete(transactions).where(eq(transactions.id, id))

    return "Delete successfully"
}

export const updatePaymentInstallment = async (
    id: number,
    cash: number,
) => {
    const isExist = await getTransactionById(id)

    const currentShift = await getLatestShift()

    if (isExist.total > cash)
        throw new Error("Cash not enough")

    if (!currentShift)
        throw new Error("Shift is not found")

    await db.transaction(async tx => {
        await tx.update(transactions).set({
            payment_status: "completed",
            payment_date: new Date(),
            transaction_status: "completed",
        }).where(eq(transactions.id, isExist.id))
    })

    return "Payment successfully"
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

    const total = exisitngTransaction.items.reduce((acc, prev) => acc += prev.sub_total, 0);
    const disc = total * transaction.discount;
    const tax = total * transaction.tax;

    if ((total - disc - tax) < 0)
        throw new Error("Total transaction is not valid")

    await db.update(transactions).set({
        buyer: transaction.buyer,
        discount: transaction.discount,
        tax: transaction.tax,
        payment_method: transaction.paymentMethod,
        transaction_status: transaction.transactionStatus,
        payment_expired: transaction.expired ? new Date(transaction.expired) : null,
        total: total - disc - tax
    })

}

export const getTransaction = async (
    page: number = 1,
    limit: number = 15,
    code?: string,
    payment_method?: "cash" | "installment",
    payment_status?: "pending" | "completed" | "cancelled"
) => {

    const skip = (page - 1) * limit;

    const totalItem = await db.select({ count: sql`COUNT(*)` }).from(transactions).where(and(
        payment_method ? eq(transactions.payment_method, payment_method) : undefined,
        code ? like(transactions.code_transaction, `%${code}%`) : undefined,
        payment_status ? eq(transactions.payment_status, payment_status) : undefined
    ));

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
        },
        where(fields, operators) {
            return operators.and(
                payment_method ? operators.eq(fields.payment_method, payment_method) : undefined,
                code ? operators.like(fields.code_transaction, `%${code}%`) : undefined,
                payment_status ? operators.eq(fields.payment_status, payment_status) : undefined
            )
        },
        orderBy(fields, operators) {
            return operators.desc(fields.payment_date)
        },
    })

    return {
        pagging: {
            limit,
            page,
            total_item: totalItem[0].count as number,
            total_page: Math.ceil(totalItem[0].count as number / limit),
        },
        data: result as any[]
    }
}