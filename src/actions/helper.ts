import db from "@/db";
import { sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

export const getCountData = async (data: PgTable) => {
  const result = await db
    .select({ count: sql`COUNT(*)` })
    .from(data)
    .then((res) => res[0].count as number);
  return result
};
