import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Delete, DeleteIcon } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { Prescription } from '@models/prescription';
import { removePresciption } from '@/actions/prescription';
import useLoading from '@hooks/use-loading';
import Loading from '@components/ui/loading';

function DeletePresciption({
    data,
    handleFetch
}: TableMutation<Prescription>) {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()

    const handleDelete = async () => {
        setLoading("loading")
        try {
            const get = await removePresciption(data.id);
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
                        Rekaman Racikan akan di hapus dan stock obat akan dikembalikan
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isLoading == "loading"}>
                        <Loading isLoading={isLoading}>Hapus</Loading>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePresciption
