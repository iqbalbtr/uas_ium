import { Button } from '@components/ui/button'
import Loading from '@components/ui/loading'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { getInvoicePdf } from '@services/pdf/invoice'
import { Printer } from 'lucide-react'
import React from 'react'

function PrintInvoice({ current }: { current: string }) {

    const { isLoading, setLoading } = useLoading()

    async function handlePrint() {
        setLoading("loading")
        try {
            await getInvoicePdf(current)
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

    return (
        <Button onClick={handlePrint} disabled={isLoading == "loading"}>
            <Loading isLoading={isLoading}>
                <Printer />
            </Loading>
        </Button>
    )
}

export default PrintInvoice
