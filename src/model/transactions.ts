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
    transaction_date?: Date;
    code_transaction: string;
    buyer: string;
    user_id?: number;
    total: number;
    payment_method: PaymentMethod;
    payment_expired?: Date;
    transaction_status: TransactionStatus;
    tax?: number;
    discount?: number;
    items: TransactionItem[]
  }
  
  export interface TransactionItem {
    id: number;
    quantity: number;
    sub_total: number;
    medicine_id?: number;
    transaction_id: number;
    medicine: Medicine
  }