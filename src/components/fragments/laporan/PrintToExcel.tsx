import { Button } from '@components/ui/button'
import Loading from '@components/ui/loading'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { handleDownload } from '@libs/utils'
import { getInvoicePdf } from '@services/pdf/invoice'
import { Printer } from 'lucide-react'
import React from 'react'

function PrintToExcel({
    data,
    fileName
}: {
    data: () => Promise<any>,
    fileName: string
}) {


    const { isLoading, setLoading } = useLoading()

    async function handlePrint() {
        setLoading("loading")
        try {
            const get = await data();
            if (get) {
                await handleDownload(fileName, get as Buffer)
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

    return (
        <div>
            <Button onClick={handlePrint} disabled={isLoading == "loading"}>
                <Loading isLoading={isLoading}>
                    Cetak ke Excel<Printer />
                </Loading>
            </Button>
        </div>
    )
}

export default PrintToExcel
