"use server"

import db from "@db/index"
import { retur_transaction_item, retur_transactions, shift, transaction_item, transactions } from "@db/schema"
import { and, eq, gte, lte, sql } from "drizzle-orm"
import { getUserById, getUserByUsername } from "./auth"

export const getLatestShift = async () => {
    const shift = await db.query.shift.findFirst({
        orderBy: (sh, { desc }) => desc(sh.start_shift),
        with: {
            holder: {
                columns: {
                    name: true,
                    username: true
                }
            }
        }
    })

    return shift
}

export const createShift = async (balance_holder: string, balance: number, method_balance: boolean) => {

    const latestShift = await getLatestShift();

    const user = await getUserByUsername(balance_holder)

    if (latestShift?.status_shift === "pending")
        throw new Error("There are shift is pending")

    const totalBalance = (method_balance && latestShift ? latestShift?.cashier_balance! : 0) + balance

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

export const updateBalanceShift = async (balance: number) => {
    const latestShift = await getLatestShift();

    if (latestShift?.status_shift !== "pending")
        throw new Error("Current shift is not found");


    await db.update(shift).set({
        cashier_balance: latestShift?.cashier_balance! + balance
    }).where(eq(shift.id, latestShift?.id!))

    return "Update balance successfully"
}

export const updateEndShift = async (note: string) => {

    const latestShift = await getLatestShift()

    if (latestShift?.status_shift == "completed")
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
        balance_different: (income_total - retur_total) - (latestShift?.begining_balance! - latestShift?.cashier_balance!),
        ending_balance: income_total - retur_total,
        transaction_total: transactions.length,
    }).where(eq(shift.id, latestShift?.id!))

    return "Update end shift succssfully"
}

export const getShift = async (
    page: number = 1,
    limit: number = 5,
    order: "asc" | "desc" = "desc",
    start?: Date,
    end?: Date,
) => {

    const get = await db.query.shift.findMany({
        limit,
        offset: (page - 1) * limit,
        orderBy: (sh, od) => (od[order](sh.start_shift)),
        where: (sh, { and, lte, gte }) => and(
            start ? gte(sh.start_shift, start) : undefined,
            end ? lte(sh.end_shift, end) : undefined
        ),
        with: {
            holder: {
                columns: {
                    name: true,
                    username: true
                }
            }
        }
    })

    const count = await db.select({ count: sql`COUNT(*)` }).from(shift).where(and(
        start ? gte(shift.start_shift, start) : undefined,
        end ? lte(shift.end_shift, end) : undefined
    ))

    return {
        pagging: {
            limit,
            page,
            total_item: (count[0].count as number),
            total_page: Math.ceil((count[0].count as number) / limit),
        },
        data: get
    }
}

export const updateNoteShift = async (note: string) => {
    const latestShift = await getLatestShift();

    if (latestShift?.status_shift !== "pending")
        throw new Error("Current shift is not found");


    await db.update(shift).set({
        notes: note
    }).where(eq(shift.id, latestShift?.id!))

    return "Update note successfully"
}


export const getDifferenceIncome = async () => {
    const latestShift = await getLatestShift();

    if (!latestShift?.start_shift) {
      return [];
    }
    
    const sales = await db
    .select({
      hour: sql<string>`TO_CHAR(${transactions.transaction_date}, 'HH24:00')`,
      date: sql<Date>`DATE(${transactions.transaction_date})`,
      sellingTotal: sql<number>`SUM(${transaction_item.quantity})`,
    })
    .from(transactions)
    .leftJoin(
      transaction_item,
      sql`${transactions.id} = ${transaction_item.transaction_id}`
    )
    .where(
      gte(transactions.transaction_date, latestShift.start_shift)
    )
    .groupBy(
      sql`DATE(${transactions.transaction_date}), TO_CHAR(${transactions.transaction_date}, 'HH24:00')`
    )
    .orderBy(({ date, hour }) => [
      sql`${date} ASC`,
      sql`${hour} ASC`,
    ]);
    
      console.log(sales, new Date(latestShift.start_shift!).getHours());
      

    const retur = await db
      .select({
        hour: sql<string>`TO_CHAR(${retur_transactions.retur_date}, 'HH24:00')`,
        date: sql<Date>`DATE(${retur_transactions.retur_date})`,
        returTotal: sql<number>`SUM(${retur_transaction_item.qty})`,
      })
      .from(retur_transactions)
      .leftJoin(
        retur_transaction_item,
        sql`${retur_transactions.id} = ${retur_transaction_item.retur_transaction_id}`
      )
      .where(
        gte(retur_transactions.retur_date, latestShift.start_shift)
      )
      .groupBy(
        sql`DATE(${retur_transactions.retur_date}), TO_CHAR(${retur_transactions.retur_date}, 'HH24:00')`
      )
      .orderBy(({ date, hour }) => [
        sql`${date} ASC`,
        sql`${hour} ASC`,
      ]);
    
    return sales.map((sale) => {
      const matchingRetur = retur.find((r) => r.hour === sale.hour && r.date.getTime() === sale.date.getTime());
      return {
        ...sale,
        returTotal: matchingRetur?.returTotal ?? 0,
      };
    });
}