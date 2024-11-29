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

export const getRoleByAccess = (data: string[]) => {
    let result: typeof nav = [];

    nav.forEach((fo) => {
        if (data.includes(fo.path)) {
            result.push({ ...fo, child_path: [] });
        }

        if (fo.child_path?.length) {
            fo.child_path.forEach((fa) => {
                if (data.includes(fa.path)) {
                    const parentIndex = result.findIndex((d) => d.id === fo.id);

                    if (parentIndex > -1) {
                        result[parentIndex].child_path.push(fa);
                    } else {
                        result.push({
                            ...fo,
                            child_path: [fa],
                        });
                    }
                }
            });
        }
    });

    return result;
};

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