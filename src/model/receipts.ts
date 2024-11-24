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
    paymentMethod: PaymentMethod; // Enum
    paymentExpired: Date;
    receiptStatus: ReceiptStatus; // Enum
    requestStatus: RequestStatus; // Enum
    orderId: number;
    order: Order
}