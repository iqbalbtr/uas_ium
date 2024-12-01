import { Medicine } from "./medicines";
import { User } from "./users";

enum PaymentMethod {
    Cash = "cash",
    Installment = "installment",
}

enum OrderStatus {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled",
}

export interface Order {
    id: number;
    order_code: string;
    order_date: Date | string;
    supplier: string;
    order_status: OrderStatus;
    total: number;
    tax: number;
    discount: number;
    total_item: number;
    total_item_received: number;
    request_status: "not_yet" | "full" | "partial";
    payment_method: PaymentMethod;
    payment_status: "pending" | "completed" | "cancelled";
    payment_expired: Date | string;
    order_medicines: OrderMedicine[];
}

export interface OrderMedicine {
    id: number;
    order_id: number;
    medicine_id: number;
    quantity: number;
    sub_total: number;
    received_total: number;
    price: number;
    medicine: Medicine;
}