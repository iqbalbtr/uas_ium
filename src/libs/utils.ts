export const ObjectValidation = (obj: object) => Object.keys((val: string) => {
    if (!val[obj as keyof typeof obj])
        throw new Error("All field must be filled")
})