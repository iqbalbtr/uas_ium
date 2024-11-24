import { Medicine } from "./medicines";

export interface Prescription {
    id: number;
    prescriptionDate: Date;
    name: string;
    description?: string;
    doctorName?: string;
    patientName?: string;
    instructions?: string;
    medicines: PrescriptionMedicine[]
}

export interface PrescriptionMedicine {
    id: number;
    prescriptionId: number;
    medicineId?: number; // Nullable
    quantity: number;
    notes?: string;
    medicine?: Medicine
}
