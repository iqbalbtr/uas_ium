import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import nav from "@assets/json/nav.json"

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