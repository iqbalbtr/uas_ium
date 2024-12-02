import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";

export const payment_method_enum = pgEnum("payment_method", [
  "cash",
  "installment",
]);
export const payment_status_enum = pgEnum("payment_status", [
  "pending",
  "completed",
  "cancelled",
]);
export const order_status_enum = pgEnum("order_status", [
  "pending",
  "completed",
  "cancelled",
]);
export const transaction_status_enum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "cancelled",
]);
export const receipt_status_enum = pgEnum("receipt_status", [
  "accepted",
  "rejected",
  "pending",
]);
export const request_status_enum = pgEnum("request_status", [
  "not_yet",
  "partial",
  "full",
]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 55 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("available"),
  role_id: integer("role_id")
    .references(() => roles.id)
    .notNull(),
});

export const auth = pgTable("auth", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token"),
  last_logged: timestamp("last_logged").defaultNow(),
});

export const roles = pgTable("roles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 55 }).unique().notNull(),
  access_rights: json("access_rights"),
});

export const user_relations = relations(users, ({ one }) => ({
  auth: one(auth),
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
}));

export const medicines = pgTable("medicines", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  active_ingredients: varchar("active_ingredients", { length: 255 }).notNull(),
  expired: integer("expired").notNull(),
  indication: text("indication").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").default(0).notNull(),
  side_effect: text("side_effect"),
  medicine_code: varchar("medicine_code", { length: 255 }).notNull().unique(),
  medicine_type: varchar("medicine_type", { length: 100 }).notNull(),
  medicine_category: varchar("medicine_category", { length: 100 }).notNull(),
});

export const medicine_reminder = pgTable("medicine_reminder", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  medicine_id: integer("medicine_id").references(() => medicines.id, {
    onDelete: "set null",
  }),
  min_stock: integer("min_stock"),
  max_stock: integer("max_stock"),
});

export const medicine_relations = relations(medicines, ({ one }) => ({
  medicine_reminder: one(medicine_reminder, {
    fields: [medicines.id],
    references: [medicine_reminder.medicine_id],
  }),
}));

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  order_code: varchar("order_code", { length: 100 }).unique().notNull(),
  order_date: timestamp("order_date").defaultNow(),
  supplier: varchar("supplier", { length: 100 }).notNull(),
  order_status: order_status_enum().default("pending"),
  total: integer("total").notNull(),
  tax: integer("tax").notNull(),
  discount: integer("discount").default(0),
  total_item: integer("total_item").notNull(),
  total_item_received: integer("total_item_received").notNull(),
  request_status: request_status_enum().default("not_yet"),
  payment_method: payment_method_enum().default("cash"),
  payment_status: payment_status_enum().default("pending"),
  payment_expired: timestamp("payment_expired").notNull(),
});

export const order_medicine = pgTable("order_medicine", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  medicine_id: integer("medicine_id").references(() => medicines.id, {
    onDelete: "set null",
  }),
  quantity: integer("quantity").notNull(),
  sub_total: integer("sub_total").notNull(),
  received_total: integer("received_total").notNull(),
  price: integer("price").notNull(),
});

export const order_relations = relations(orders, ({ many }) => ({
  order_medicines: many(order_medicine),
}));

export const order_medicine_relations = relations(
  order_medicine,
  ({ one }) => ({
    medicine: one(medicines, {
      fields: [order_medicine.medicine_id],
      references: [medicines.id],
    }),
    order: one(orders, {
      fields: [order_medicine.order_id],
      references: [orders.id],
    }),
  })
);

export const receipts = pgTable("receipts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  receipt_code: varchar("receipt_code", { length: 100 }).unique().notNull(),
  receipt_status: receipt_status_enum().default("pending"),
  total_received_item: integer("total_received_item").notNull(),
  delivery_name: varchar("delivery_name", { length: 100 }).notNull(),
  order_id: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
});

export const receipt_medicine = pgTable("receipt_medicine", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  receipt_id: integer("receipt_id")
    .references(() => receipts.id, { onDelete: "cascade" })
    .notNull(),
  order_medicine_id: integer("order_medicine_id").references(() => order_medicine.id, {
    onDelete: "set null",
  }),
  received: integer("received").notNull(),
});

export const receipt_medicine_relations = relations(
  receipt_medicine,
  ({ one }) => ({
    order_medicine: one(order_medicine, {
      fields: [receipt_medicine.order_medicine_id],
      references: [order_medicine.id],
    }),
    receipt: one(receipts, {
      fields: [receipt_medicine.receipt_id],
      references: [receipts.id],
    })
  })
);

export const receipt_relations = relations(receipts, ({ many, one }) => ({
  receipt_medicines: many(receipt_medicine),
  order: one(orders, { fields: [receipts.order_id], references: [orders.id] })
}));

export const prescriptions = pgTable("prescriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code_prescription: varchar("code_prescription", { length: 100 })
    .unique()
    .notNull(),
  prescription_date: timestamp("prescription_date").notNull(),
  name: varchar("name", { length: 55 }).notNull(),
  doctor_name: varchar("doctor_name", { length: 50 }),
  description: text("description"),
  price: integer("price").notNull(),
  discount: integer("discount").default(0),
  fee: integer("fee").default(0),
  tax: integer("tax").default(0),
  instructions: text("instructions"),
});

export const prescription_medicine = pgTable("prescription_medicine", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  prescription_id: integer("prescription_id")
    .references(() => prescriptions.id, { onDelete: "cascade" })
    .notNull(),
  medicine_id: integer("medicine_id").references(() => medicines.id, {
    onDelete: "set null",
  }),
  quantity: integer("quantity").notNull(),
  notes: text("notes"),
});

export const prescription_medicine_relations = relations(
  prescription_medicine,
  ({ one }) => ({
    medicine: one(medicines, {
      fields: [prescription_medicine.medicine_id],
      references: [medicines.id],
    }),
    prescription: one(prescriptions, {
      fields: [prescription_medicine.prescription_id],
      references: [prescriptions.id],
    }),
  })
);

export const prescriptions_relations = relations(prescriptions, ({ many }) => ({
  prescription_medicines: many(prescription_medicine),
}));

export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  transaction_date: timestamp("transaction_date").defaultNow(),
  code_transaction: varchar("code_transaction", { length: 50 })
    .unique()
    .notNull(),
  buyer: varchar("buyer", { length: 100 }).default("guest").notNull(),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  total: integer("total").notNull(),
  payment_method: payment_method_enum().default("cash"),
  payment_expired: timestamp("payment_expired"),
  payment_status: payment_status_enum().default("pending"),
  transaction_status: transaction_status_enum().default("completed"),
  tax: integer("tax").default(0),
  discount: integer("discount").default(0),
});

export const transaction_item = pgTable("transaction_item", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quantity: integer("quantity").notNull(),
  sub_total: integer("sub_total").notNull(),
  medicine_id: integer("medicine_id").references(() => medicines.id, {
    onDelete: "set null",
  }),
  transaction_id: integer("transaction_id")
    .references(() => transactions.id, { onDelete: "cascade" })
    .notNull(),
});

export const transaction_relations = relations(
  transactions,
  ({ many, one }) => ({
    items: many(transaction_item),
    user: one(users, {
      fields: [transactions.user_id],
      references: [users.id],
    }),
  })
);

export const transaction_item_relations = relations(
  transaction_item,
  ({ one }) => ({
    medicine: one(medicines, {
      fields: [transaction_item.medicine_id],
      references: [medicines.id],
    }),
    transaction: one(transactions, {
      fields: [transaction_item.transaction_id],
      references: [transactions.id],
    }),
  })
);

export const apotek = pgTable("apotek", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 55 }).notNull(),
  email: varchar("email", { length: 55 }),
  phone: varchar("phone", { length: 30 }),
  alamat: text("alamat"),
});
