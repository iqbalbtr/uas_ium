"use client"
import { updatePaymentStatus } from '@/actions/order'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog'
import { Button } from '@components/ui/button'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { Order } from '@models/orders'
import { TableMutation } from '@models/view'
import React, { useEffect, useState } from 'react'

function UpdateStatusPayment({ data, handleFetch }: TableMutation<Order>) {

    const { isLoading, setLoading } = useLoading()
    
    const [isOpen, setOpen] = useState(false)

    const handleUpdate = async () => {
        try {
            setLoading("loading")
            const get = await updatePaymentStatus(data.id);
            if (get) {
                toast({
                    title: "Success",
                    description: get
                })
                handleFetch && handleFetch()
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })

        } finally {
            setLoading("loading")
        }

    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    Bayar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin membayar pesanan ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Status pembayaran akan di upate selesai
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleUpdate} disabled={isLoading == "loading"}>Bayar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UpdateStatusPayment
