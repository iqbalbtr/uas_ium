"use client"
import { z } from "zod"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form"
import { UserSelect } from "./UserSelect"

function EndShiftUserForm({ handleFetch, notes }: { notes: string, handleFetch: () => Promise<void> }) {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()

    const userSchema = z.object({
        balance: z.number().min(0),
        balance_holder: z.string().min(1),
        notes: z.string().trim().optional()
    })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            balance: 0,
            balance_holder: "",
            notes: notes
        },
    })


    async function handleEnd(values: z.infer<typeof userSchema>) {
        setLoading("loading")
        try {
            const res = await updateEndShift(values.balance, values.balance_holder, notes)
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEnd)} className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='balance'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Saldo Kasir
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="balance"
                                                placeholder="Saldo.."
                                                type="text"
                                                className="placeholder:opacity-50"
                                                {...field}
                                                onChange={(e) => field.onChange(!isNaN(Number(e.target.value)) ? Number(e.target.value) : field.value)}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='balance_holder'
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel>
                                            Pemegang Selanjutnya
                                        </FormLabel>
                                        <FormControl>
                                            <UserSelect value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='notes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Catatan
                                        </FormLabel>
                                        <FormControl>
                                            <TextArea
                                                value={field.value}
                                                onChange={field.onChange}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Apabila ada{" "}
                            <span className="font-medium">selisih saldo shift</span>, silakan
                            isi kolom catatan untuk memberi penjelasan ke Owner. Agar tidak
                            terjadi salah paham.
                        </div>
                        <AlertDialogFooter>
                            <Button disabled={isLoading == "loading"} type='submit' className="w-fit">
                                <Loading isLoading={isLoading}>
                                    Tutup
                                </Loading>
                            </Button>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EndShiftUserForm
