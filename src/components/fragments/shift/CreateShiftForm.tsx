"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { createUser } from '@/actions/auth';
import { RoleSelect } from '../role/RoleSelect';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { UserPlus } from 'lucide-react';
import { createShift } from '@/actions/shift';
import { UserSelect } from './UserSelect';

function CreateShiftForm() {

    const { isLoading, setLoading } = useLoading();
    const [isOpen, setOpen] = useState(false);

    const userSchema = z.object({
        balance: z.number().min(0),
        balance_holder: z.string().min(1),
    })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            balance: 0,
            balance_holder: ""
        },
    })


    const handleCreate = async (values: z.infer<typeof userSchema>) => {
        try {
            setLoading("loading")
            const res = await createShift(values.balance_holder, values.balance);
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
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
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='balance_holder'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Pemegang saldo
                                        </FormLabel>
                                        <FormControl>
                                            <UserSelect value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                            {isLoading == "loading" ? "Loading" : "Tambah"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

export default CreateShiftForm
