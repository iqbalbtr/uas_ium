import { Medicine } from "./medicines";

export interface Prescription {
    id: number;
    code_prescription: string;
    prescription_date: Date;
    name: string;
    description?: string;
    doctor_name?: string;
    price: number;
    discount: number;
    fee: number;
    tax: number;
    instructions?: string;
    prescription_medicines: PrescriptionMedicine[]
  }
  
  export interface PrescriptionMedicine {
    id: number;
    prescription_id: number;
    medicine_id?: number;
    quantity: number;
    notes?: string;
    medicine: Medicine
  }