"use server"
import db from "@db/index"
import { activity_log } from "@db/schema"
import { authOption } from "@libs/auth"
import { ActivityLog } from "@models/log"
import { sql } from "drizzle-orm"
import { getServerSession, User } from "next-auth"

export const getUserActivity = async (
    user_id: number,
    page: number = 1,
    limit: number = 5
) => {

    const get = await db.query.activity_log.findMany({
        where: (log, { eq, and }) => and(
            eq(log.user_id, user_id)
        ),
        limit,
        offset: (page - 1) * limit,
        with: {
            user: {
                columns: {
                    id: true,
                    email: true,
                    name: true,
                    username: true
                }
            }
        },
        orderBy(fields, operators) {
            return operators.desc(fields.date)
        },
    })

    const total_item = await db.select({ count: sql`COUNT(*)` }).from(activity_log);    

    return {
        pagging: {
            limit,
            page,
            total_item: Number(total_item[0].count),
            total_page: Math.ceil(Number(total_item[0].count) / limit)
        },
        result: get as ActivityLog[]
    }
}

export const createActivityLog = async (
    cb: (user: User) => {
        title: string,
        action_name: string,
        action_type: "create" | "update" | "delete",
        description: string
    }
) => {

    try {
        const data = await getServerSession(authOption);
        if(!data)
            return;        
        const res = cb(data?.user!)        
        await db.insert(activity_log).values({
            user_id: data?.user.id,
            ...res
        })
        
    } catch (error: any) {
        console.error(error.message)
    }
}

export const getLatestActivity = async (limit: number = 5) => {
    const get = await db.query.activity_log.findMany({
        orderBy(fields, operators) {
            return (
                operators.desc(fields.date)
            )
        },
        with: {
            user: {
                columns: {
                    name: true,
                    username: true
                }
            }
        },
        limit
    })

    return get
}