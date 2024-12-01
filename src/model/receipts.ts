import { Medicine } from "./medicines";
import { Order, OrderMedicine } from "./orders";

enum PaymentMethod {
    Cash = "cash",
    Installment = "installment",
}

enum ReceiptStatus {
    Accepted = "accepted",
    Rejected = "rejected",
    Pending = "pending",
}

enum RequestStatus {
    Full = "full",
    Partial = "partial",
}

export interface Receipt {
    id: number;
    receipt_code: string;
    receipt_status: string;
    total_received_item: number;
    delivery_name: string;
    order_id: number;
    receipt_medicines: ReceiptMedicine[];
    order: Order
}
export interface ReceiptMedicine {
    id: number;
    receipt_id: number;
    order_medicine_id: number;
    received: number;
    order_medicine: OrderMedicine;
}