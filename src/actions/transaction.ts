"use server"

import db from "@/db"
import { getMedicineById } from "./medicine";
import { medicines, shift, transaction_item, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ResponseList } from "@/model/response";
import { ObjectValidation } from "@/lib/utils";
import { getLatestShift } from "./shift";

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
        buyer: string,
        payment_method: "cash" | "installment",
        payment_expired?: Date,
        transaction_status: "pending" | "completed" | "cancelled",
        discount: number;
        tax: number;
    },
    items: TransactionItem[],
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
        const isExist = await getMedicineById(it.medicineId)

        if (!isExist)
            throw new Error("Medicine is not found")

        if (isExist.stock - it.qty < 0) {
            throw new Error(`${isExist.name} stock is not enough`)
        }

        return {
            medicineId: isExist.id,
            subTotal: (isExist.selling_price * it.qty),
            diffenceTotal: (isExist.selling_price * it.qty) - (isExist.purchase_price * it.qty),
            qty: it.qty,
            stock: isExist.stock - it.qty
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

        if ((cash - (total - disc + tax)) > currentShift?.cashier_balance!)
            throw new Error("Cashier balance is not enough")
    }

    const code = await db.select({ count: sql`COUNT(*)` }).from(transactions)

    const payment_status = transaction.payment_method == "cash" ? "completed" : "pending"

    await db.transaction(async tx => {
        const trans = await tx.insert(transactions).values({
            buyer: transaction.buyer,
            discount: transaction.discount,
            payment_method: transaction.payment_method,
            tax: transaction.tax,
            transaction_status: transaction.transaction_status,
            total: total - disc + tax,
            user_id: userId,
            transaction_date: new Date(),
            payment_status,
            payment_expired: transaction.payment_expired ? new Date(transaction.payment_expired) : null,
            code_transaction: "TS" + String(code[0].count as number),
            payment_date: transaction.payment_method == "cash" ? new Date() : null
        }).returning()

        for (const item of allItem) {

            await tx.update(medicines).set({
                stock: item.stock
            })

            await tx.insert(transaction_item).values({
                quantity: item.qty,
                sub_total: item.subTotal,
                transaction_id: trans[0].id,
                medicine_id: item.medicineId,
                difference_sub_total: item.diffenceTotal
            })
        }

        if (transaction.payment_method == "cash")
            await tx.update(shift).set({
                cashier_balance: (currentShift?.cashier_balance! - (cash! - (total - disc + tax)))
            }).where(eq(shift.id, currentShift?.id!))
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

    if (cash > currentShift?.cashier_balance!)
        throw new Error("Cashier balance is not enough")

    await db.transaction(async tx => {
        await tx.update(transactions).set({
            payment_status: "completed",
            payment_date: new Date()
        }).where(eq(transactions.id, isExist.id))

        await tx.update(shift).set({
            cashier_balance: currentShift?.cashier_balance! - (cash - isExist.total)
        }).where(eq(shift.id, currentShift?.id!))
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
        },
        where(fields, operators) {
            return operators.and(
                payment_method ? operators.eq(fields.payment_method, payment_method) : undefined,
                code ? operators.like(fields.code_transaction, `%${code}%`) : undefined,
                payment_status ? operators.eq(fields.payment_status, payment_status) : undefined
            )
        },
    })

    return {
        limit,
        page,
        total_item: totalItem[0].count,
        total_page: Math.ceil(totalItem[0].count as number / limit),
        data: result
    } as ResponseList<any>
}