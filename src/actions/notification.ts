"use server"
import db from "@db/index";
import { notif } from "@db/schema";
import { authOption } from "@libs/auth";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const createNotif = async (type: "stock" | "expired", medicine_id: number, payload: { title: string; description: string; }) => {

    const session = await getServerSession(authOption)

    if (!session?.user)
        return;

    await db.insert(notif).values({
        title: payload.title,
        description: payload.description,
        type: type,
        medicine_id,
        user_id: session?.user.id
    })
}

export const getNotifInterval = async (len: number): Promise<any[]> => {

    const session = await getServerSession(authOption)

    if (!session)
        throw new Error("Session is not found");

    return new Promise((resolve, reject) => {

        const int = setInterval(async () => {
            try {
                const countResult = await db
                    .select({ count: sql`COUNT(*)` })
                    .from(notif)
                    .where(eq(notif.id, session.user.id));

                const count = Number(countResult[0]?.count || 0);

                if (count !== len) {
                    const res = await db.query.notif.findMany({
                        where: ({ user_id }, { eq }) => eq(user_id, session.user.id),
                    });



                    clearInterval(int);
                    resolve(res);
                }
            } catch (error) {
                clearInterval(int);
                reject(error);
            }
        }, 1000 * 60 * 10 )
    });
}

export const deleteNotif = async (id: number) => {
    const isExist = await db.select({ count: sql`COUNT(*)` }).from(notif).where(eq(notif.id, id))
    console.log(isExist);

    if (isExist[0].count as number == 0) {
        throw new Error("Notif is not found")
    }

    await db.delete(notif).where(eq(notif.id, id))
}

export const getNotiUser = async () => {

    const session = await getServerSession(authOption)

    if (!session)
        throw new Error("Session is not found");

    const res = await db.query.notif.findMany({
        where: ({ user_id }, { eq }) => eq(user_id, session.user.id),
    });

    return res;
}

export const updateNotifExpired = async () => {
    // const get = await db
    // .select()
    // .from(receipt_medicine)
    // .where(and(
    //     lte((receipts.ordermedicines.expired))
    // ))
    // .leftJoin(receipts, eq(receipt_medicine.receipt_id, receipts.id))
    // .leftJoin(orders, eq(receipts.order_id, orders.id))
    // .leftJoin(order_medicine, eq(order_medicine.id, receipt_medicine.order_medicine_id))
    // .leftJoin(medicines, eq(medicines.id, order_medicine.medicine_id))
}
