import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import nav from "@assets/json/nav.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isZeroStart = (val: number | string) => {
    return String(val).length == 1 ? `0${val}` : String(val)
}

export const ObjectValidation = (obj: object) => Object.keys((val: string) => {
    if (!val[obj as keyof typeof obj])
        throw new Error("All field must be filled")
})

export const getDateFormat = (date: number | string | Date, separator: string = "-") => {
    try {
        const isDate = new Date(date);
        return isZeroStart(isDate.getDate()) + separator + isZeroStart( isDate.getMonth() + 1) + separator + isDate.getFullYear()
    } catch (error) {
        return "Invalid"
    }
}

export function generateCode(count: number) {

    const now = new Date();

    const isDate = now.getFullYear() + isZeroStart(now.getMonth() + 1).toString() + isZeroStart(now.getDate())

    return `ODR-${isDate}-${count.toString().padEnd(4, "0")}`
}

export const getRupiahFormat = (num: number) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
}).format(num)

export const formatCurrentTime = (time: Date) => {
    const now = new Date();
    const value = new Date(time);
    const diffInSeconds = Math.floor((now.getTime() - value.getTime()) / 1000); // Selisih waktu dalam detik

    if (diffInSeconds < 60) {
        // Kurang dari 1 menit
        return `${diffInSeconds} detik lalu`;
    } else if (diffInSeconds < 60 * 60) {
        // Kurang dari 1 jam
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} menit lalu`;
    } else if (diffInSeconds < 24 * 60 * 60) {
        // Kurang dari 1 hari
        const hours = Math.floor(diffInSeconds / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        return `${hours} jam, ${minutes} menit lalu`;
    } else {
        // Lebih dari 1 hari
        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        return `${days} hari lalu`;
    }
};
