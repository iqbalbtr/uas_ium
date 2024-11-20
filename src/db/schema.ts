import { relations } from "drizzle-orm"
import { pgTable, integer, varchar, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 55 }).notNull(),
    password: varchar("password", { length: 255 }).notNull()
})

export const auth = pgTable("auth", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => users.id),
    token: text(),
    lastLogged: timestamp().defaultNow()
})

export const userRelation = relations(users, ({ one }) => ({
    auth: one(auth),
}));