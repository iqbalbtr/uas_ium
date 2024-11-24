"use server"

import db from "@/db"
import { roles, users } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { getCountData } from "./helper"

export type RoleAssignts = string[]

export const getRoleById = async (id: number) => {

    const getRole = await db.query.roles.findFirst({
        where: (role, { eq }) => (eq(role.id, id))
    })

    if(!getRole)
        throw new Error("Role is not found")

    return getRole;
}

export const createRole = async (
    name: string,
    roleAssignts: RoleAssignts
) => {
    
    const isExisting = await db.query.roles.findFirst({
        where: (role, {eq}) => (eq(role.name, name))
    })

    if(isExisting)
        throw new Error("Role name already exist")

    await db.insert(roles).values({
        name,
        access_rights: roleAssignts
    })

    return "Role created successfully"
}

export const removeRole = async (
    id: number
) => {

    const count = await db.select({count: sql`COUNT(*)`}).from(users).where(eq(users.roleId, id))

    if(count[0].count as number > 0)
        throw new Error("Role still used")

    await db.delete(roles).where(eq(roles.id, id))

    return "Role deleted successfully"
}

export const updateRole = async (
    id: number,
    name: string,
    roleAssignts: RoleAssignts
) => {

    await getRoleById(id);

    const isExisting = await db.query.roles.findFirst({
        where: (role, {eq}) => (eq(role.name, name))
    })

    if(isExisting)
        throw new Error("Role name already exist")

    await db.update(roles).set({
        name,
        access_rights: roleAssignts
    }).where(eq(roles.id, id))

    return "Role update successfully"
}

export const getRole = async (
    page: number = 1,
    limit: number = 15
) => {

    const skip = (page - 1) * limit;

    const count = await getCountData(roles)
    
    const result = await db.query.roles.findMany({
        limit,
        offset: skip
    })

    return {
        limit,
        page,
        total_item: count,
        total_page: Math.ceil(count / limit),
        data: result
    }
}