"use server";

import db from "@/db";
import { and, eq, like, ne, sql } from "drizzle-orm";
import { getCountData } from "./helper";
import { ResponseList } from "@/model/response";
import { Item } from "@/app/dashboard/kasir/page";
import { getMedicineById } from "./medicine";
import { generateCode, ObjectValidation } from "@libs/utils";
import { order_medicine, orders } from "@db/schema";
import { createActivityLog } from "./activity-log";

export type MedicineOrder = {
  medicineId: number;
  subTotal: number;
  quantity: number;
  price: number;
};

export const getOrderById = async (id: number) => {
  const isExist = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      order_medicines: {
        with: {
          medicine: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new Error("Order is not found");
  }

  return isExist;
};

export const getOrderMedicineById = async (id: number) => {
  const isExist = await db.query.order_medicine.findFirst({
    where: (order, { eq }) => eq(order.id, id),
    with: {
      medicine: {
        columns: {
          stock: true,
          name: true,
        },
        with: {
          medicine_reminder: {
            columns: {
              max_stock: true
            }
          }
        }
      },
    },
  });

  if (!isExist) {
    throw new Error("Order is not found");
  }

  return isExist;
};

export const getOrderByCode = async (id: string) => {
  const isExist = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.order_code, id),
    with: {
      order_medicines: {
        with: {
          medicine: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new Error("Order is not found");
  }

  return isExist;
};

export const createOrder = async (
    items: Item[],
    order: {
        supplier: string;
        orderStatus: "cancelled" | "completed" | "pending",
        tax: number;
        discount: number,
        payment_method: "cash" | "installment",
        payment_expire?: Date
    }
) => {

    if (!items.length)
        throw new Error("Medicine minimum is one");

  if (order.payment_method == "installment" && !order.payment_expire) {
    throw new Error("Payment expred required");
  }
  if (
    order.payment_method == "installment" &&
    order.payment_expire &&
    new Date(order.payment_expire).getTime() - new Date().getTime() < 0
  )
    throw new Error("Date is not valid");

  const expired = order.payment_expire
    ? new Date(order.payment_expire)
    : new Date();

    const isValidate = items.map(async (m) => {
        const isExist = await getMedicineById(m.id);

    if (!isExist) throw new Error("Medicine is not found");

    return {
      medicine: isExist,
      payload: m,
    };
  });

  const requestMedicine = await Promise.all(isValidate);

  const count = await db.select({ count: sql`COUNT(*)` }).from(orders);
  const code = generateCode(count[0].count as number);

    const totalOrder = items.reduce((acc, prev) => acc += (prev.purchase_price * prev.qty), 0);

  const totalTax = (order.tax / 100) * totalOrder;

  const totalDisc = (order.discount / 100) * totalOrder;

  const totalItem = requestMedicine.reduce(
    (acc, pv) => (acc += pv.payload.qty),
    0
  );

  const total = totalOrder - totalDisc + totalTax;

  if (total < 0) throw new Error("Total is not valid");

  await db.transaction(async (tx) => {
    const newOrder = await tx
      .insert(orders)
      .values({
        ...order,
        total_item_received: 0,
        total_item: totalItem,
        order_code: code,
        total: total,
        request_status: "not_yet",
        payment_method: order.payment_method,
        payment_expired: expired,
        payment_status:
          order.payment_method == "cash" ? "completed" : "pending",
      })
      .returning();

    for (const med of requestMedicine) {
      await tx.insert(order_medicine).values({
        order_id: newOrder[0].id,
        quantity: med.payload.qty,
        sub_total: med.payload.qty * med.medicine.purchase_price,
        received_total: 0,
        price: med.medicine.purchase_price,
        medicine_id: med.medicine.id,
      });
    }
  });

  await createActivityLog((user) => ({
    action_name: "Membuat Pesananan",
    action_type: "create",
    description: `${user.name} mengubah informasi pesanan`,
    title: "Ubah pesanan",
  }));

  return "Order succesfully added";
};

export const removeOrder = async (id: number) => {
  const count = await db
    .select({ count: sql`COUNT(*)` })
    .from(orders)
    .where(eq(orders.id, id));

  if (count[0].count == 0) {
    throw new Error("Order is not found");
  }

  await db.delete(orders).where(eq(orders.id, id));

  await createActivityLog((user) => ({
    action_name: "Menghapus Pesanan",
    action_type: "delete",
    description: `${user.name} menghapus informasi pesanan`,
    title: "Menghapus Pesanan",
  }));
  
  return "Remove order successfully";
};

export const updateOrder = async (
  id: number,
  order: {
    supplier: string;
    orderStatus: "cancelled" | "completed" | "pending";
    tax: number;
    discount: number;
    date: Date;
    payment_method: "cash" | "installment";
    payment_expire?: Date;
  }
) => {
  ObjectValidation(order);

  if (order.payment_method == "installment" && !order.payment_expire) {
    throw new Error("Payment expred required");
  }
  if (
    order.payment_method == "installment" &&
    order.payment_expire &&
    new Date(order.payment_expire).getTime() - new Date().getTime() < 0
  )
    throw new Error("Date is not valid");

  const isOrder = await getOrderById(id);

  const total = isOrder.order_medicines.reduce(
    (acc, pv) => (acc += pv.quantity * pv.price),
    0
  );

  const totalTax = (order.tax / 100) * total;

  const totalDisc = (order.discount / 100) * total;

  if (isOrder.total - totalDisc - totalTax < 0)
    throw new Error("Total is not valid");

  await db.update(orders).set({
    ...order,
    order_date: order.date,
    total: total - totalDisc + totalTax,
  });

  await createActivityLog((user) => ({
    action_name: "Mengubah Pesanan",
    action_type: "update",
    description: `${user.name} mengubah informasi pesanan`,
    title: "Ubah pesanan",
  }));

  return "Update order successfully";
};

export const getOrder = async (
  page: number = 1,
  limit: number = 15,
  query?: string,
  status_received?: "not_yet" | "partial" | "full",
  status_payment?: "pending" | "cancelled" | "completed"
) => {
  const skip = (page - 1) * page;

    const count = (await db.select({count: sql`COUNT(*)`}).from(orders).where(and(
        query ? like(sql`LOWER(${orders.order_code})`, `%${query?.toLocaleLowerCase()}%`) : undefined,
        status_received ? ne(orders.request_status, status_received) : undefined,
        status_payment ? eq(orders.payment_status, status_payment) : undefined
    )))[0].count as number;
    const result = await db.query.orders.findMany({
        with: {
            order_medicines: {
                with: {
                    medicine: true
                }
            }
        },
        limit,
        offset: skip,
        orderBy: ({ order_date }, { desc }) => (desc(order_date)),
        where({ order_code, request_status, payment_status }, { like, eq, and, ne }) {
            return and(
                query ? like(sql`LOWER(${order_code})`, `%${query?.toLocaleLowerCase()}%`) : undefined,
                status_received ? ne(request_status, status_received) : undefined,
                status_payment ? eq(payment_status, status_payment) : undefined
            )
        },
    })

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

export async function updatePaymentStatus(id: number){
    await getOrderById(id)

    await db.update(orders).set({
        payment_status: "completed"
    }).where(eq(orders.id, id))

    return "Payment successfully"
}

export const getAllMedicineOrderById = async(id: number) => {
    const get = await db.query.order_medicine.findMany({
        where: (od, {eq}) => (eq(od.order_id, id)),
        with: {
            medicine: {
                columns: {
                    name: true,
                    medicine_code: true
                }
            }
        }
    })

    return get
}