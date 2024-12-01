"use client"
import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { DeleteIcon } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { Medicine } from '@models/medicines';
import { removeMedicine } from '@/actions/medicine';

function DeleteMedicine({
    data,
    handleFetch
}: TableMutation<Medicine>) {

    const [isOpen, setOpen] = useState(false)

    const handleDelete = async () => {
        try {
            const get = await removeMedicine(data.id);
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
                        Rekaman obat yang berada di penjualan transaksi atau racikan mungkin akan terhapus atau tidak ada!
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

export default DeleteMedicine
