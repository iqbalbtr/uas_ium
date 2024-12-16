"use server"

import db from "@db/index"
import { retur_transaction_item, retur_transactions, shift, transaction_item, transactions, users } from "@db/schema"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { getUserById, getUserByUsername } from "./auth"

export const getLatestShift = async () => {
    const res = await db.select({
        id: shift.id,
        start_shift: shift.start_shift,
        end_shift: shift.end_shift,
        begining_balance: shift.begining_balance,
        retur_item_total: shift.retur_item_total,
        retur_total: shift.retur_total,
        notes: shift.notes,
        ending_balance: shift.ending_balance,
        balance_different: shift.balance_different,
        income_total: shift.income_total,
        transaction_total: shift.transaction_total,
        status_shift: shift.status_shift,
        cashier_balance: shift.cashier_balance,
        receivables_total: shift.receivables_total,
        sales_total: shift.sales_total,
        holder: {
            username: users.username,
            name: users.name
        }
    }).from(shift)
        .leftJoin(users, eq(users.id, shift.balance_holder))
        .orderBy(desc(shift.start_shift))

    return res[0]
}

export const createShift = async (balance: number) => {

    const latestShift = await getLatestShift();

    if (latestShift?.status_shift === "pending")
        throw new Error("There are shift is pending")


    await db.insert(shift).values({
        balance_holder: null,
        begining_balance: balance,
        receivables_total: 0,
        sales_total: 0,
        cashier_balance: 0,
        income_total: 0,
        balance_different: 0,
        ending_balance: 0,
        transaction_total: 0,
        retur_item_total: 0,
        retur_total: 0
    })

    return "Create shift successfully"
}

export const getShiftById = async (id: number) => {
    const get = await db.query.shift.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id)
        },
    })

    if (!get)
        throw new Error("Shift is not found")

    return get
}

export const updateBalanceShift = async (balance: number) => {
    const latestShift = await getLatestShift();

    if (latestShift?.status_shift !== "pending")
        throw new Error("Current shift is not found");


    await db.update(shift).set({
        cashier_balance: balance
    }).where(eq(shift.id, latestShift?.id!))

    return "Update balance successfully"
}

export const updateEndShift = async (cashier_balance: number, holder: string, note: string) => {
    const latestShift = await getLatestShift();
    if (!latestShift) throw new Error("No active shift found");

    if (latestShift.status_shift === "completed")
        throw new Error("Current shift has already been completed");

    const user = await getUserByUsername(holder);
    if (!user) throw new Error("User not found");

    const currentDate = new Date();

    const transactionsCash = await db.query.transactions.findMany({
        where: (tr, { and, gte, lte, eq }) => and(
            gte(tr.payment_date, latestShift.start_shift!),
            lte(tr.payment_date, currentDate),
            eq(tr.payment_method, "cash")
        )
    });

    const transactionsInstallment = await db.query.transactions.findMany({
        where: (tr, { and, gte, lte, eq }) => and(
            gte(tr.payment_date, latestShift.start_shift!),
            lte(tr.payment_date, currentDate),
            eq(tr.payment_method, "installment")
        )
    });

    const retur_transactions = await db.query.retur_transactions.findMany({
        where: (tr, { and, gte, lte }) => and(
            gte(tr.retur_date, latestShift.start_shift!),
            lte(tr.retur_date, currentDate),
        )
    });

    const cash_total = transactionsCash.reduce((acc, pv) => acc + pv.total, 0);
    const installment_total = transactionsInstallment.reduce((acc, pv) => acc + pv.total, 0);
    const income_total = cash_total + installment_total;
    const retur_total = retur_transactions.reduce((acc, pv) => acc + (pv.total_retur ?? 0), 0);
    const retur_item_total = retur_transactions.reduce((acc, pv) => acc + (pv.total_item ?? 0), 0);
    const ending_balance = income_total - retur_total;

    await db.update(shift).set({
        end_shift: currentDate,
        status_shift: "completed",
        balance_holder: user.id,
        income_total,
        notes: note,
        cashier_balance,
        retur_total,
        retur_item_total,
        balance_different: ending_balance - cashier_balance,
        ending_balance,
        transaction_total: transactionsCash.length + transactionsInstallment.length,
        receivables_total: installment_total,
        sales_total: cash_total
    }).where(eq(shift.id, latestShift.id));

    return "Update end shift successfully"
};

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
    const current = new Date();
    const lastSixHour = new Date(current.getTime() - 6 * 60 * 60 * 1000);

    const generateHourlyRange = (start: Date, end: Date) => {
        const hours = [];
        let current = new Date(start).getHours();

        while (current <= end.getHours()) {
            hours.push({
                hour: `${current}:00`,
                sellingTotal: 0,
                returTotal: 0,
            });
            ++current
        }

        return hours;
    };

    if (!latestShift?.start_shift) {
        return [];
    }

    const sales = await db
        .select({
            hour: sql<string>`TO_CHAR(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00')`, // Format jam (perjam, HH:mm)
            date: sql<Date>`DATE(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')`, // Format tanggal
            sellingTotal: sql<number>`SUM(${transaction_item.quantity})`, // Total penjualan
        })
        .from(transactions)
        .leftJoin(
            transaction_item,
            sql`${transactions.id} = ${transaction_item.transaction_id}` // Relasi transaksi dan item
        )
        .where(
            and(
                gte(
                    sql`${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'`,
                    lastSixHour // Filter berdasarkan waktu 6 jam terakhir
                ),
                gte(
                    sql`${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'`,
                    latestShift.start_shift // Filter berdasarkan waktu shift
                )
            )
        )
        .groupBy(
            sql`DATE(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'), TO_CHAR(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00')` // Grup per tanggal dan jam
        )
        .orderBy(
            sql`DATE(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') ASC, TO_CHAR(${transactions.transaction_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00') ASC` // Urutkan berdasarkan tanggal dan jam
        );

    const retur = await db
        .select({
            hour: sql<string>`TO_CHAR(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00')`, // Format jam (perjam, HH:mm)
            date: sql<Date>`DATE(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')`, // Format tanggal
            returTotal: sql<number>`SUM(${retur_transaction_item.qty})`, // Total penjualan
        })
        .from(retur_transactions)
        .leftJoin(
            retur_transaction_item,
            sql`${retur_transactions.id} = ${retur_transaction_item.retur_transaction_id}` // Relasi transaksi dan item
        )
        .where(
            gte(
                sql`${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'`,
                latestShift.start_shift // Filter berdasarkan waktu shift
            )
        )
        .groupBy(
            sql`DATE(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'), TO_CHAR(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00')` // Grup per tanggal dan jam
        )
        .orderBy(
            sql`DATE(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') ASC, TO_CHAR(${retur_transactions.retur_date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'HH24:00') ASC` // Urutkan berdasarkan tanggal dan jam
        );

    const hourlyData = generateHourlyRange(lastSixHour, current);

    hourlyData.forEach((hour) => {
        const sale = sales.find(
            (s) => s.hour == hour.hour
        );
        const returData = retur.find(
            (s) => s.hour == hour.hour
        );

        if (sale) {
            hour.sellingTotal = +sale.sellingTotal;
        }
        if (returData) {
            hour.returTotal = +returData.returTotal
        }
    });

    return hourlyData
}