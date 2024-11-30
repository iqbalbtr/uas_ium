import { Medicine } from "./medicines";

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
    order_date?: Date;
    order_code: string;
    supplier: string;
    order_status: OrderStatus;
    total: number;
    tax: number;
    payment_method: PaymentMethod;
    payment_expired?: Date;
    discount: number;
    order_medicines: OrderMedicine[]
}

export interface OrderMedicine {
    id: number;
    order_id: number;
    medicine_id?: number;
    quantity: number;
    sub_total: number;
    price: number;
    medicine: Medicine
}