"use server";

import db from "@/db";
import { roles, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { NavType } from "@components/app/app-sidebar";
import { createActivityLog } from "./activity-log";

export type RoleAssignts = NavType[];

export const getRoleById = async (id: number) => {
  const getRole = await db.query.roles.findFirst({
    where: (role, { eq }) => eq(role.id, id),
  });

  if (!getRole) throw new Error("Role is not found");

  return getRole;
};

export const getRoleByName = async (name: string) => {
  const getRole = await db.query.roles.findFirst({
    where: (role, { eq }) => eq(role.name, name),
  });

  if (!getRole) throw new Error("Role is not found");

  return getRole;
};

export const createRole = async (name: string, roleAssignts: RoleAssignts) => {
  const isExisting = await db.query.roles.findFirst({
    where: (role, { eq }) => eq(role.name, name),
  });

  if (isExisting) throw new Error("Role name already exist");

  await db.insert(roles).values({
    name,
    access_rights: roleAssignts,
  });

  await createActivityLog((user) => ({
    action_name: "Membuat Role",
    action_type: "create",
    description: `${user.name} membuat informasi role`,
    title: "Membuat Role",
  }));
  return "Role created successfully";
};

export const removeRole = async (id: number) => {
  const count = await db
    .select({ count: sql`COUNT(*)` })
    .from(users)
    .where(eq(users.role_id, id));

  if ((count[0].count as number) > 0) throw new Error("Role still used");

  await db.delete(roles).where(eq(roles.id, id));

  await createActivityLog((user) => ({
    action_name: "Menghapus Role",
    action_type: "delete",
    description: `${user.name} menghapus informasi role`,
    title: "Menghapus role",
  }));
  return "Role deleted successfully";
};

export const updateRole = async (
  id: number,
  name: string,
  roleAssignts: RoleAssignts
) => {
  await getRoleById(id);

  const isExisting = await db.query.roles.findMany({
    where: (role, { eq }) => eq(role.name, name),
  });

  await db
    .update(roles)
    .set({
      name,
      access_rights: roleAssignts,
    })
    .where(eq(roles.id, id));

    await createActivityLog((user) => ({
        action_name: "Mengupdate Role",
        action_type: "update",
        description: `${user.name} mengupdate informasi role`,
        title: "Mengupdate role",
      }));
  return "Role update successfully";
};

export const getRole = async (
  page: number = 1,
  limit: number = 15,
  name?: string
) => {
  const skip = (page - 1) * limit;

  const count = await getCountData(roles);

  const result = await db.query.roles.findMany({
    limit,
    offset: skip,
    where: (role, { like }) =>
      name ? like(role.name, `%${name}%`) : undefined,
  });

  return {
    pagging: {
      limit,
      page,
      total_item: count,
      total_page: Math.ceil(count / limit),
    },
    data: result,
  };
};
