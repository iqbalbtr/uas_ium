import db from "@/db"
import * as schema from "@/db/schema"
import { sql } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"

export const getCountData = async(data: PgTable) => {
    return db.select({count: sql`COUNT(*)`}).from(data).then(res => res[0].count as number)
}