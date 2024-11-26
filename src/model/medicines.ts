export interface Medicine {
    id: number;
    name: string;
    dosage?: string;
    active_ingredients: string;
    expired: Date;
    indication: string;
    price: number;
    stock: number;
    side_effect?: string;
    medicine_code: string;
    medicine_type: string;
    medicine_category: string;
    medicine_reminder?: MedicineReminder
}

export interface MedicineReminder {
    id: number;
    medicine_id?: number;
    min_stock?: number;
    max_stock?: number;
}