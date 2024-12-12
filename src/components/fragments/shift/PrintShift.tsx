"use client"
import { Button } from '@components/ui/button'
import Loading from '@components/ui/loading'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { getShiftPdf } from '@services/pdf/shift'
import { Printer } from 'lucide-react'
import React from 'react'

function PrintShift({ id }: { id: number }) {

    const { isLoading, setLoading } = useLoading()

    async function handleDownload() {
        setLoading("loading")
        try {
            await getShiftPdf(id)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message
            })
        } finally {
            setLoading("idle")
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            disabled={isLoading == "loading"}
        >
            <Loading isLoading={isLoading}>
                <Printer />
            </Loading>
        </Button>
    )
}

export default PrintShift
