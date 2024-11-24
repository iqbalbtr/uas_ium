
export interface Medicine {
    id: number;
    name: string;
    dosage?: string;
    activeIngredients: string;
    expired: Date;
    indication: string;
    price: number;
    stock: number; // Defaults to 0
    sideEffect?: string;
    medicineCode: string; // Unique
    medicineType: string;
    medicineCategory: string;
    reminder: MedicineReminder
}

interface MedicineReminder {
    id: number;
    medicineId?: number; 
    minStock?: number;
    maxStock?: number;
}