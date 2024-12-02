import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { DeleteIcon } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { Prescription } from '@models/prescription';
import { removePresciption } from '@/actions/prescription';

function DeletePresciption({
    data,
    handleFetch
}: TableMutation<Prescription>) {

    const [isOpen, setOpen] = useState(false)

    const handleDelete = async () => {
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
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className='text-destructive'>
                    <DeleteIcon />
                </Button>
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
                    <Button onClick={handleDelete}>Hapus</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePresciption
