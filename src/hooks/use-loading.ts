"use client"

import { useState } from "react"
export type LoadingType = "success" | "loading" | "error" | "idle"

export default function useLoading(){
    
    const [isLoading, setLoading] = useState<LoadingType>("idle")
    
    return {
        isLoading,
        setLoading
    }
}