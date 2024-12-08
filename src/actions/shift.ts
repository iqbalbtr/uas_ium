"use server"

import db from "@db/index"
import { shift } from "@db/schema"
import { eq } from "drizzle-orm"
import { getUserById, getUserByUsername } from "./auth"

export const getLatestShift = async() => {
    const shift = await db.query.shift.findFirst({
        orderBy: (sh, {desc}) => desc(sh.start_shift) 
    })

    // if(!shift)
    //     throw new Error("Shift is not exist, please create new shift")

    return shift
}

export const createShift = async(balance_holder: string, balance: number, method_balance: boolean) => {

    const latestShift = await getLatestShift();

    const user = await getUserByUsername(balance_holder)

    if(latestShift?.status_shift === "pending")
        throw new Error("There are shift is pending")

    const totalBalance = (method_balance ? latestShift?.cashier_balance! : 0) + balance

    await db.insert(shift).values({
        balance_holder: user.id,
        begining_balance: totalBalance,
        cashier_balance: totalBalance,
        income_total: 0,
        balance_different: 0,
        ending_balance: 0,
        transaction_total: 0,
        retur_item_total: 0,
        retur_total: 0
    })

    return "Create shift successfully"
}

export const updateBalanceShift = async(balance: number) => {
    const latestShift = await getLatestShift();

    if(latestShift?.status_shift !== "pending")
        throw new Error("Current shift is not found");

    
    await db.update(shift).set({
        cashier_balance: latestShift?.cashier_balance! + balance
    }).where(eq(shift.id, latestShift?.id!))
    
    return "Update balance successfully"
}

export const updateEndShift = async(note: string) => {

    const latestShift = await getLatestShift()
    
    if(latestShift?.status_shift == "completed")
        throw new Error("Current shift is not found");
    
    const currentDate = new Date();
    
    const transactions = await db.query.transactions.findMany({
        where: (tr, { and, gte, lte, eq }) => and(
            gte(tr.transaction_date, latestShift?.start_shift!),
            lte(tr.transaction_date, currentDate),
        )
    });    

    const retur_transactions = await db.query.retur_transactions.findMany({
        where: (tr, { and, gte, lte, eq }) => and(
            gte(tr.retur_date, latestShift?.start_shift!),
            lte(tr.retur_date, currentDate),
        )
    });

    const income_total = transactions.reduce((acc, pv) => acc += pv.total, 0);
    const retur_total = retur_transactions.reduce((acc, pv) => acc += pv.total_retur!, 0)
    const retur_item_total = retur_transactions.reduce((acc, pv) => acc += pv.total_item!, 0)

    await db.update(shift).set({
        end_shift: new Date(),
        status_shift: "completed",
        income_total,
        notes: note,
        retur_total,
        retur_item_total,
        balance_different: (income_total - retur_total) - latestShift?.cashier_balance!,
        ending_balance: income_total - retur_total,
        transaction_total: transactions.length,
    }).where(eq(shift.id, latestShift?.id!))

    return "Update end shift succssfully"
}