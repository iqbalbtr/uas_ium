import { Medicine } from "./medicines";

enum OrderStatus {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled",
}

export interface Order {
    id: number;
    orderDate?: Date; 
    supplier: string;
    orderStatus: OrderStatus; 
    total: number;
    tax: number;
    discount?: number; 
    medicines: OrderMedicine[]
}

export interface OrderMedicine {
    id: number;
    orderId: number;
    medicineId?: number; 
    quantity: number;
    subTotal: number;
    price: number;
    medicine?: Medicine
}
