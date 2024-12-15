import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Delete, DeleteIcon } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { Order } from '@models/orders';
import { removeOrder } from '@/actions/order';
import useLoading from '@hooks/use-loading';
import Loading from '@components/ui/loading';

function DeleteOrder({
    data,
    handleFetch
}: TableMutation<Order>) {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()

    const handleDelete = async () => {
        setLoading("loading")
        try {
            const get = await removeOrder(data.id);
            if (get) {
                toast({
                    title: "Success",
                    description: get
                })
                handleFetch && handleFetch()
                setOpen(false)
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
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className={`bg-red-400/70 p-1 rounded-md border border-red-600`}>
                    <Delete size={15} className={`text-red-700`} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin menghapus?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Rekaman pemesanan beserta penerimaan berserta penerimaan akan di hapus!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isLoading == "loading"}>
                        <Loading isLoading={isLoading}>
                            Hapus
                        </Loading>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteOrder
