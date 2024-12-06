"use client"
import { updateEndShift } from '@/actions/shift'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog'
import { Button } from '@components/ui/button'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import React, { useState } from 'react'

function EndShiftUserForm() {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()

    async function handleEnd() {
        setLoading("loading")
        try {
            const res = await updateEndShift()
            if(res){
                setOpen(false)
                toast({
                    title: "Success",
                    description: "Sesi berhasil di tutup"
                })
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
                <Button>
                    Tutup shift
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin mengakhiri shift?</AlertDialogTitle>
                    <AlertDialogDescription>
                        --
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={isLoading == "loading"} onClick={handleEnd}>Tutup</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EndShiftUserForm
