import { Medicine } from "./medicines";

enum PaymentMethod {
    Cash = "cash",
    Installment = "installment",
}

enum TransactionStatus {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled",
}

export interface Transaction {
    id: number;
    transactionDate?: Date; // Defaults to now
    buyer: string; // Defaults to "guest"
    userId?: number; // Nullable
    total: number;
    paymentMethod: PaymentMethod; // Enum
    paymentExpired?: Date;
    transactionStatus: TransactionStatus; // Enum
    tax?: number; // Defaults to 0
    discount?: number; // Defaults to 0
    items: TransactionItem[]
}

export interface TransactionItem {
    id: number;
    quantity: number;
    subTotal: number;
    medicineId?: number; // Nullable
    transactionId: number;
    medicine?: Medicine
}