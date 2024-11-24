import { relations } from "drizzle-orm"
import { pgTable, integer, varchar, text, timestamp, pgEnum, json } from "drizzle-orm/pg-core"

export const paymentMethodEnum = pgEnum("payment_method", ["cash", "installment"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "completed", "cancelled"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "cancelled"]);
export const receiptStatusEnum = pgEnum("receipt_status", ["accepted", "rejected", "pending"]);
export const requestStatusEnum = pgEnum("request_status", ["full", "partial"]);

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 55 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    email: varchar("email", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("available"),
    roleId: integer("role_id").references(() => roles.id).notNull()
});

export const auth = pgTable("auth", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    token: text("token"),
    lastLogged: timestamp("last_logged").defaultNow()
});

export const roles = pgTable("role", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 55 }).unique().notNull(),
    access_rights: json("access_rights")
})

export const userRelations = relations(users, ({ one }) => ({
    auth: one(auth),
    role: one(roles),
}));

export const medicines = pgTable("medicines", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    dosage: varchar("dosage", { length: 100 }),
    activeIngredients: varchar("active_ingredients", { length: 255 }).notNull(),
    expired: timestamp("expired").notNull(),
    indication: text("indication").notNull(),
    price: integer("price").notNull(),
    stock: integer("stock").default(0).notNull(),
    sideEffect: text("side_effect"),
    medicineCode: varchar("medicine_code", { length: 255 }).notNull().unique(),
    medicineType: varchar("medicine_type", { length: 100 }).notNull(),
    medicineCategory: varchar("medicine_category", { length: 100 }).notNull()
});

export const medicineReminder = pgTable("medicine_reminder", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    medicineId: integer("medicine_id").references(() => medicines.id, { onDelete: "set null" }),
    min_stock: integer("min_stock"),
    max_stock: integer("max_stock"),
})

export const medicineRelations = relations(medicines, ({ one }) => ({
    medicine_reminder: one(medicineReminder)
}))

export const orders = pgTable("orders", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderDate: timestamp("order_date").defaultNow(),
    supplier: varchar("supplier", { length: 100 }).notNull(),
    orderStatus: orderStatusEnum().default("pending"),
    total: integer("total").notNull(),
    tax: integer("tax").notNull(),
    discount: integer("discount").default(0)
});

export const orderMedicine = pgTable("order_medicine", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
    medicineId: integer("medicine_id").references(() => medicines.id, { onDelete: "set null" }),
    quantity: integer("quantity").notNull(),
    subTotal: integer("sub_total").notNull(),
    price: integer("price").notNull()
});

export const orderRelations = relations(orders, ({ many }) => ({
    medicines: many(orderMedicine)
}));

export const orderMedicineRelations = relations(orderMedicine, ({ one }) => ({
    medicine: one(medicines, { fields: [orderMedicine.medicineId], references: [medicines.id] }),
    order: one(orders, { fields: [orderMedicine.orderId], references: [orders.id] })
}));

export const receipts = pgTable("receipts", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    paymentMethod: paymentMethodEnum().default("cash"),
    paymentExpired: timestamp("payment_expired").notNull(),
    receiptStatus: receiptStatusEnum().default("pending"),
    requestStatus: requestStatusEnum().default("full"),
    orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull()
});

export const prescriptions = pgTable("prescriptions", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    prescriptionDate: timestamp("prescription_date").notNull(),
    name: varchar("name", { length: 55 }).notNull(),
    description: text("description"),
    doctorName: varchar("doctor_name", { length: 50 }),
    patientName: varchar("patient_name", { length: 50 }),
    instructions: text("instructions")
});

export const prescriptionMedicine = pgTable("prescription_medicine", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    prescriptionId: integer("prescription_id").references(() => prescriptions.id, { onDelete: "cascade" }).notNull(),
    medicineId: integer("medicine_id").references(() => medicines.id, { onDelete: "set null" }),
    quantity: integer("quantity").notNull(),
    notes: text("notes")
});

export const prescriptionMedicineRelations = relations(prescriptionMedicine, ({ one }) => ({
    medicine: one(medicines, { fields: [prescriptionMedicine.medicineId], references: [medicines.id] }),
    prescription: one(prescriptions, { fields: [prescriptionMedicine.prescriptionId], references: [prescriptions.id] })
}));

export const prescriptionsRelations = relations(prescriptions, ({ many }) => ({
    medicines: many(prescriptionMedicine)
}));

export const transactions = pgTable("transactions", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    transaction_date: timestamp("transaction_date").defaultNow(),
    buyer: varchar("buyer", { length: 100 }).default("guest").notNull(),
    user_id: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    total: integer("total").notNull(),
    paymentMethod: paymentMethodEnum().default("cash"),
    paymentExpired: timestamp("payment_expired"),
    transactionStatus: transactionStatusEnum().default("completed"),
    tax: integer("tax").default(0),
    discount: integer("discount").default(0)
});

export const transactionItem = pgTable("transaction_item", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    quantity: integer("quantity").notNull(),
    subTotal: integer("sub_total").notNull(),
    medicineId: integer("medicine_id").references(() => medicines.id, { onDelete: "set null" }),
    transactionId: integer("transaction_id").references(() => transactions.id, { onDelete: "cascade" }).notNull()
});

export const transactionRelations = relations(transactions, ({ many, one }) => ({
    items: many(transactionItem),
    user: one(users, { fields: [transactions.user_id], references: [users.id] })
}));

export const transactionItemRelations = relations(transactionItem, ({ one }) => ({
    medicine: one(medicines, { fields: [transactionItem.medicineId], references: [medicines.id] }),
    transaction: one(transactions, { fields: [transactionItem.transactionId], references: [transactions.id] })
}));

export const apotek = pgTable("apotek", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 55 }).notNull(),
    email: varchar("email", { length: 55 }),
    phone: varchar("phone", { length: 30 }),
    alamat: text("alamat")
})