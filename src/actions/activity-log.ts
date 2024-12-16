"use server"
import db from "@db/index"
import { activity_log, users } from "@db/schema"
import { authOption } from "@libs/auth"
import { ActivityLog } from "@models/log"
import { sql, eq, and, desc } from "drizzle-orm"
import { getServerSession, User } from "next-auth"

export const getUserActivity = async (
    user_id: number,
    page: number = 1,
    limit: number = 5
) => {
    const offset = (page - 1) * limit;

    const get = await db
        .select({
            id: activity_log.id,
            title: activity_log.title,
            action_name: activity_log.action_name,
            action_type: activity_log.action_type,
            description: activity_log.description,
            date: activity_log.date,
            user: {
                id: users.id,
                email: users.email,
                name: users.name,
                username: users.username
            }
        })
        .from(activity_log)
        .leftJoin(users, eq(users.id, activity_log.user_id))
        .where(and(eq(activity_log.user_id, user_id)))
        .orderBy(desc(activity_log.date))
        .limit(limit)
        .offset(offset);

    const total_item = await db
        .select({ count: sql`COUNT(*)` })
        .from(activity_log);

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
        if (!data)
            return;
        const res = cb(data?.user!);
        await db
            .insert(activity_log)
            .values({
                user_id: data?.user.id,
                ...res
            });
    } catch (error: any) {
        console.error(error.message);
    }
}

export const getLatestActivity = async (limit: number = 5) => {
    
    const session = await getServerSession(authOption);
    
    const get = await db
        .select({
            id: activity_log.id,
            title: activity_log.title,
            action_name: activity_log.action_name,
            action_type: activity_log.action_type,
            description: activity_log.description,
            date: activity_log.date,
            user: {
                name: users.name,
                username: users.username
            }
        })
        .from(activity_log)
        .leftJoin(users, eq(users.id, activity_log.user_id))
        .where(eq(activity_log.user_id, session?.user.id!))
        .orderBy(desc(activity_log.date))
        .limit(limit);

    return get;
}
