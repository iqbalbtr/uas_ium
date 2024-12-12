"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { createShift } from '@/actions/shift';
import { UserSelect } from './UserSelect';
import { Switch } from '@components/ui/switch';
import Loading from '@components/ui/loading';

function CreateShiftForm({ handleFetch }: { handleFetch: () => Promise<void> }) {

    const { isLoading, setLoading } = useLoading();
    const [isOpen, setOpen] = useState(false);

    const userSchema = z.object({
        balance: z.number().min(0)
    })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            balance: 0
        },
    })


    const handleCreate = async (values: z.infer<typeof userSchema>) => {
        try {
            setLoading("loading")            
            const res = await createShift( values.balance);
            if (res) {
                toast({
                    title: "Success",
                    description: res
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
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default">
                    Buka Shift
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Tambah User</SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='balance'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Saldo
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
                        <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                            <Loading isLoading={isLoading}>
                                Buka
                            </Loading>
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

export default CreateShiftForm
