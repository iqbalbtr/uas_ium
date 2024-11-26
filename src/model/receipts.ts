import { Order } from "./orders";

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
    payment_method: PaymentMethod;
    payment_expired: Date;
    receipt_status: ReceiptStatus;
    request_status: RequestStatus;
    order: Order
  }