import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { DeleteIcon } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { deleteUser } from '@/actions/auth';
import { User } from '@/model/users';
import useLoading from '@hooks/use-loading';
import Loading from '@components/ui/loading';

function DeleteUser({
    data,
    handleFetch
}: TableMutation<User>) {

    const [isOpen, setOpen] = useState(false)
    const {isLoading, setLoading} = useLoading()

    const handleDelete = async () => {
        setLoading("loading")
        try {
            const get = await deleteUser(data.id);
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
                <Button variant="ghost" className='text-destructive'>
                    <DeleteIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin menghapus?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Semua data rengkaman tersebut akan dihapus secara permanen
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={isLoading == "loading"} onClick={handleDelete}>
                        <Loading isLoading={isLoading}>
                            Hapus
                        </Loading>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUser
