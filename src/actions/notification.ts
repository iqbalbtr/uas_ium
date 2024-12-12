"use server"

// import db from "@db/index"
// import { medicine_reminder, medicines, transactions } from "@db/schema"
// import { and, eq, gte, lt, lte, or, sql } from "drizzle-orm"

// export const getNotification = async () => {
//     const getMinMax = await db.select()
//         .from(medicines)
//         .innerJoin(medicine_reminder, eq(medicines.id, medicine_reminder.id))
//         .where(or(
//             lte(medicines.stock, medicine_reminder.min_stock),
//             gte(medicines.stock, medicine_reminder.max_stock)
//         ));

//     const lastThreeDays = new Date().getTime() - (60 * 60 * 24 * 3);

//     const getExpire = await db.select()
//         .from(transactions)
//         .where(and(
//             gte(new Date(lastThreeDays), transactions.payment_expired),
//             eq(transactions.payment_method, "installment"),
//             eq(transactions.payment_status, "pending")
//         ))

//     const updateNotif = getMinMax.map(async fo => {
//     })
// }
import { authOption } from "@libs/auth";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import conf from "@assets/json/firebase-service.json"

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: conf.client_email,
        privateKey: conf.private_key,
        projectId: conf.project_id,
    })
});

// const registrationToken = 'BLs5QZuyUjEZ22H6fR23IY0Y6X-VBewnKxeMCh-IyiJ1gIvCLexEHbPakde5xpHXTKdi6GWwFJRXYY555I6FX84'; 


export const sendMessage = async (payload: {title: string, body: string}) => {

    const session = await getServerSession(authOption);

    console.log(session);
    

    if(!session?.user.FcmToken)
        throw new Error("Session required")

    const message = {
        notification: payload,
        token: session?.user.FcmToken!,
    };
    admin.messaging().send(message)
        .then((response) => {
            console.log('Pesan berhasil dikirim:', response);
        })
        .catch((error) => {
            console.log('Gagal mengirim pesan:', error);
        });

}