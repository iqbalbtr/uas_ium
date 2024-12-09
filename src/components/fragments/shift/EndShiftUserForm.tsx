"use client"
import { updateEndShift } from '@/actions/shift'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import Loading from '@components/ui/loading'
import { TextArea } from '@components/ui/textarea'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { Printer } from 'lucide-react'
import React, { useState } from 'react'

function EndShiftUserForm({ handleFetch }: { handleFetch: () => Promise<void> }) {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()
    const [notes, setNotes] = useState("")

    async function handleEnd() {
        setLoading("loading")
        try {
            const res = await updateEndShift(notes)
            if (res) {
                toast({
                    title: "Success",
                    description: "Sesi berhasil di tutup"
                })
                await handleFetch()
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
                <Button>
                    Tutup shift
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin mengakhiri shift?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tutup shift sekarang, data transaksi dan obat akan di proses.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <div className="space-y-2">
                        <Label htmlFor="catatan">Catatan</Label>
                        <TextArea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            id="catatan"
                            placeholder="Masukkan catatan"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Apabila ada{" "}
                        <span className="font-medium">selisih saldo shift</span>, silakan
                        isi kolom catatan untuk memberi penjelasan ke Owner. Agar tidak
                        terjadi salah paham.
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={isLoading == "loading"} onClick={handleEnd}>
                        <Loading isLoading={isLoading}>
                            Tutup
                        </Loading>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EndShiftUserForm
