"use server";

import db from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { getRoleByName } from "./role";
import { and, eq, like, sql } from "drizzle-orm";
import { ObjectValidation } from "@/lib/utils";
import { User } from "@/model/users";
import { getServerSession } from "next-auth";
import { authOption } from "@libs/auth";

export const getUserById = async (id: number) => {
  if (!id) throw new Error("id required");

  const get = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: {
      role: true,
    },
  });

  if (!get) throw new Error("User is not found");

  return get;
};

export const getUserByUsername = async (id: string) => {
  if (!id) throw new Error("id required");

  const get = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, id),
    with: {
      role: true,
    },
  });

  if (!get) throw new Error("User is not found");

  return get;
};

export const createUser = async (data: {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
}) => {
  ObjectValidation(data);

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, data.username),
  });

  if (existingUser) throw new Error("Username already exist!");

  const role = await getRoleByName(data.role);

  const hash = await bcrypt.hash(data.password, 10);

  await db.insert(users).values({
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    role_id: role.id,
    password: hash
  })

  return "Created user successfully"
}

export const getUser = async (page: number = 1, limit: number = 15, query?: string) => {
  const skip = (page - 1) * limit;

  const count = await db.select({ count: sql`COUNT(*)` }).from(users).where(and(
    query ? like(users.username, `%${query}%`) : undefined,
    query ? like(users.name, `%${query}%`) : undefined
  ));

  const result = await db.query.users.findMany({
    limit,
    offset: skip,
    with: {
      role: true,
    },
    where: (user, { like, and }) => and(
      query ? like(user.username, `%${query}%`) : undefined,
      query ? like(user.name, `%${query}%`) : undefined
    ),
    columns: {
      id: true,
      username: true,
      email: true,
      name: true,
      phone: true,
      status: true,
    },
  });

  return {
    data: result as User[],
    pagging: {
      limit,
      page,
      total_item: count[0].count as number,
      total_page: Math.ceil((count[0].count as number) / limit),
    },
  };
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  phone: string,
  role: string,
  password?: string
) => {

  if (
    !id ||
    !email ||
    !name ||
    !role
  )
    throw new Error("All field must be filled1")

  await getUserById(id)

  const isRole = await getRoleByName(role)

  const hash = password ? bcrypt.hashSync(password, 10) : undefined

  await db.update(users).set({
    email,
    phone,
    name,
    role_id: isRole.id,
    password: hash
  }).where(eq(users.id, id))

  return "Update user seuccessfully"
}

export const selftUpdateUser = async (
  name: string,
  email: string,
  phone: string,
  password?: string,
  confirm?: string
) => {

  if (
    !email ||
    !name
  )
    throw new Error("All field must be filled")
    
    if(password && !confirm)
      throw new Error("All field password must be filled")

  const session = await getServerSession(authOption)

  if(!session || !session.user.id)
    throw new Error("Error authorization")

  const user = await getUserById(+session?.user.id!)

  if(password){
    const compare = bcrypt.compareSync(confirm!, user.password)
    if(!compare)
      throw new Error("Password is wrong")
  }

  const hash = password ? bcrypt.hashSync(password, 10) : undefined

  await db.update(users).set({
    email,
    phone,
    name,
    password: hash
  }).where(eq(users.id, session?.user.id!))

  return "Update user seuccessfully"
}

export const deleteUser = async (id: number) => {
  await getUserById(id);

  await db.delete(users).where(eq(users.id, id));

  return "Delete user successfully";
};
