import { medicines, order_medicine, orders, roles, transaction_item, transactions, users } from "@db/schema"
import { getCountData } from "./helper"
import db from "@db/index";
import { and, desc, gte, lte, sql } from "drizzle-orm";
const monthsIndonesian = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  

export const getData = async () => {
    const totalUser = await getCountData(users);
    const totalMedicine = await getCountData(medicines);
    const totalTransaction = await getCountData(transactions);
    const totalOrder = await getCountData(orders);
    const totalRole = await getCountData(roles);

    return {
        totalMedicine,
        totalOrder,
        totalRole,
        totalTransaction,
        totalUser
    }
}

export const getAnalisytTypeTransaction = async () => {

    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)


    const result = await db
        .select({
            category: medicines.medicine_category,
            sellingTotal: sql<number>`SUM(${transaction_item.quantity})`,
        })
        .from(transaction_item)
        .leftJoin(medicines, sql`${transaction_item.medicine_id} = ${medicines.id}`)
        .leftJoin(transactions, sql`${transaction_item.transaction_id} = ${transactions.id}`)
        .where(and(gte(transactions.transaction_date, currentMonthStart), lte(transactions.transaction_date, currentMonthEnd)))
        .groupBy(medicines.medicine_category)
        .orderBy(({ sellingTotal }) => desc(sellingTotal))
        .limit(5);

    return result.map(fo => ({ name: fo.category ?? "", value: +fo.sellingTotal }))
}

export const getAnalisytStatisticTransaction = async () => {

    const monthlySales = await db
    .select({
        month: sql<number>`EXTRACT(MONTH FROM ${transactions.transaction_date})`,
        year: sql<number>`EXTRACT(YEAR FROM ${transactions.transaction_date})`,
        sellingTotal: sql<number>`SUM(${transaction_item.quantity})`,
    })
    .from(transactions)
    .leftJoin(
        transaction_item,
        sql`${transactions.id} = ${transaction_item.transaction_id}`
    )
    .groupBy(sql`EXTRACT(YEAR FROM ${transactions.transaction_date}), EXTRACT(MONTH FROM ${transactions.transaction_date})`)
    .orderBy(({ year, month }) => [
        sql`${year} ASC`,
        sql`${month} ASC`,
    ]);
    
    const monthlyOrder = await db
    .select({
        month: sql<number>`EXTRACT(MONTH FROM ${orders.order_date})`,
        year: sql<number>`EXTRACT(YEAR FROM ${orders.order_date})`,
        orderTotal: sql<number>`SUM(${order_medicine.quantity})`,
    })
    .from(orders)
    .leftJoin(
        order_medicine,
        sql`${orders.id} = ${order_medicine.order_id}`
    )
    .groupBy(sql`EXTRACT(YEAR FROM ${orders.order_date}), EXTRACT(MONTH FROM ${orders.order_date})`)
    .orderBy(({ year, month }) => [
        sql`${year} ASC`,
        sql`${month} ASC`,
    ]);

    return monthlySales.map((fo, i) => ({
        ...fo,
        month: monthsIndonesian[fo.month],
        orderTotal: monthlyOrder[i].orderTotal
    }))
}

export const getLatestTransaction = async() => {
    const result = await db.query.transactions.findMany({
        orderBy(fields, operators) {
            return operators.desc(fields.transaction_date)
        },
        limit: 5
    })

    return result
}