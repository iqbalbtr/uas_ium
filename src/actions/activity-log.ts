"use server"
import db from "@db/index"
import { activity_log } from "@db/schema"
import { sql } from "drizzle-orm"
import { User } from "next-auth"
import { getSession } from "next-auth/react"

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
        }
    })

    const total_item = await db.select({ count: sql`COUNT(*)` }).from(activity_log);

    return {
        pagging: {
            limit,
            page,
            total_item: total_item[0].count,
            total_page: Math.ceil(total_item[0].count as number / page)
        },
        result: get
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
        const data = await getSession();
        const res = cb(data?.user!)
        await db.insert(activity_log).values({
            user_id: data?.user.id,
            ...res
        })
    } catch (error) {
        throw new Error("Error while update activity log")
    }
}