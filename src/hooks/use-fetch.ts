"use client"
import React, { useEffect, useState } from 'react'
import useLoading from './use-loading'
import { toast } from './use-toast'

function useFetch<T>({ url, defaultValue, initialize = true }: { url: () => Promise<T>, defaultValue: T, initialize?: boolean }) {

    const [data, setData] = useState<T>(defaultValue)
    const { isLoading, setLoading } = useLoading()

    const handleGet = async () => {
        setLoading("loading")
        try {
            const get = await url()
            if(get){
                setData(get)
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading("idle")
        }
    }

    useEffect(() => {
        initialize && handleGet()
    }, [])    

    return {
        isLoading,
        refresh: handleGet,
        data
    }
}

export default useFetch
