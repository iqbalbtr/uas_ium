"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn, getDateFormat } from '@libs/utils';
import { Calendar } from '@components/ui/calendar';
import { Item } from '@/app/dashboard/kasir/page';
import { createTransaction } from '@/actions/transaction';
import { useSession } from 'next-auth/react';
import Loading from '@components/ui/loading';

function CreateTransactionForm({
    items,
    setTotal,
    setItem,
    setCurrent,
}: {
    items: Item[],
    setTotal: React.Dispatch<SetStateAction<number>>
    setItem: React.Dispatch<SetStateAction<Item[]>>
    setCurrent: React.Dispatch<SetStateAction<string>>
}) {

    const { data: user } = useSession()
    const [effectted, setEffect] = useState(false)
    const [method, setMethod] = useState(false)
    const { isLoading, setLoading } = useLoading()

    const transactionSchema = z.object({
        buyer: z.string().min(3).max(55),
        discount: z.number().min(0).max(100),
        payment_expired: z.date().optional().default(new Date()),
        payment_method: z.enum(["cash", "installment", ""]),
        tax: z.number().min(0),
        cash: z.number().min(0),
    })


    const form = useForm<z.infer<typeof transactionSchema>>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            buyer: "",
            discount: 0,
            tax: 0,
            cash: 0,
            payment_expired: new Date(),
            payment_method: "",
        },
    })

    const tax = form.getValues("tax")
    const disc = form.getValues("discount")


    useEffect(() => {
        const total = items.reduce((acc, pv) => acc += (pv.qty * pv.selling_price), 0)
        setTotal(total - ((disc / 100) * total) + ((tax / 100) * total))
    }, [items, disc, tax, effectted])


    const handleCreate = async (values: z.infer<typeof transactionSchema>) => {
        setCurrent("")
        try {
            if (!items.length)
                throw new Error("1 item min")
            setLoading("loading")
            const res = await createTransaction(user?.user.id!, {
                discount: values.discount,
                buyer: values.buyer,
                payment_expired: values.payment_expired!,
                tax: values.tax,
                payment_method: values.payment_method as "cash" | "installment",
            }, items, values.cash);
            if (res) {
                toast({
                    title: "Success",
                    description: "Transalsi berhasil",
                })
                form.reset()
                setItem([])
                setCurrent(res)
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

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name='buyer'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Pembeli
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="Pembeli"
                                        placeholder="Pembeli.."
                                        type="text"
                                        className="placeholder:opacity-50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 font-normal" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name='discount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Diskon
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="Diskon"
                                            placeholder="Diskon.."
                                            type="text"
                                            className="placeholder:opacity-50"
                                            {...field}
                                            onChange={(e) => { field.onChange(!isNaN(Number(e.target.value)) ? Number(e.target.value) : field.value); setEffect(pv => !pv) }}
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
                            name='tax'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Pajak
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="tax"
                                            placeholder="Pajak.."
                                            type="text"
                                            className="placeholder:opacity-50"
                                            {...field}
                                            onChange={(e) => { field.onChange(!isNaN(Number(e.target.value)) ? Number(e.target.value) : field.value); setEffect(pv => !pv) }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-normal" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className={`gap-2 ${method ? "grid grid-cols-2" : ""}`}>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name='payment_method'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Metode pembayaran
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e)
                                                if (e == "installment") {
                                                    setMethod(true)
                                                } else {
                                                    setMethod(false)
                                                    form.setValue("payment_expired", new Date())
                                                }
                                            }}
                                        >
                                            <SelectTrigger value={field.value}>
                                                <SelectValue placeholder="Pilih metode" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value='cash'>Tunai</SelectItem>
                                                    <SelectItem value='installment'>jatuh Tempo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-normal" />
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        method && (
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name='payment_expired'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jatuh Tempo
                                            </FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    getDateFormat(field.value)
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date()
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-normal" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )
                    }
                </div>
                {
                    !method && (
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='cash'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Pembayaran
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="cash"
                                                placeholder="cash.."
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
                    )
                }

                <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                    <Loading isLoading={isLoading}>
                        Bayar
                    </Loading>

                </Button>
            </form>
        </Form>
    )
}

export default CreateTransactionForm
