import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Delete, DeleteIcon, Edit } from 'lucide-react';
import { removeRole } from '@/actions/role';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { Role } from '@/model/roles';
import useLoading from '@hooks/use-loading';
import Loading from '@components/ui/loading';

function DeleteRole({
    data,
    handleFetch
}: TableMutation<Role>) {

    const [isOpen, setOpen] = useState(false)
    const {isLoading, setLoading} = useLoading()

    const handleDelete = async () => {
        setLoading("loading")
        try {
            const get = await removeRole(data.id);
            if (get){
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
                        Aksi menghapus role yang sedang digunakan akan di tolak, mohon priksa apakah role sedang di gunakan
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

export default DeleteRole
