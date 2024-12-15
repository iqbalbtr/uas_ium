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
import { CalendarIcon, Pen, UserPlus } from 'lucide-react';
import { updateOrder } from '@/actions/order';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { TableMutation } from '@models/view';
import { Order } from '@models/orders';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn, getDateFormat } from '@libs/utils';
import { Calendar } from '@components/ui/calendar';
import Loading from '@components/ui/loading';

function UpdateOrderForm({ data, handleFetch }: TableMutation<Order>) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)
    const [isExpire, setExpire] = useState(false)


    const userSchema = z.object({
        supplier: z.string().min(3).max(55),
        order_status: z.enum(["cancelled", "completed", "pending", ""]),
        tax: z.number().min(0).default(0),
        discount: z.number().min(0).default(0),
        date: z.date(),
        payment_method: z.enum(["cash", "installment", ""]),
        payment_expire: z.date().optional(),
        request_status: z.enum(["not_yet", "partial", "full"])
    })


    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            discount: data.discount,
            order_status: data.order_status,
            supplier: data.supplier,
            tax: data.tax,
            date: data.order_date as Date,
            request_status: data.request_status,
            payment_expire: data.payment_expired as Date,
            payment_method: data.payment_method
        },
    })


    const handleCreate = async (values: z.infer<typeof userSchema>) => {
        try {
            setLoading("loading")
            const res = await updateOrder(data.id, { ...values, orderStatus: values.order_status as any, payment_method: data.payment_method as any, date: values.date });
            if (res) {
                toast({
                    title: "Success",
                    description: res
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
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className={`bg-yellow-400/70 p-1 rounded-md border border-yellow-600`}>
                    <Pen size={15} className={`text-yellow-700`} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ubah pemesanan</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='supplier'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Supplier
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="supplier"
                                                placeholder="supplier.."
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
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tanggal
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
                                                placeholder="tax.."
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
                                name='discount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Diskon
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="discount"
                                                placeholder="discount.."
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
                                name='order_status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status Pemesanan
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status pemesanan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value='pending'>
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value='cancelled'>
                                                            Di batalkan
                                                        </SelectItem>
                                                        <SelectItem value='completed'>
                                                            Selesai
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='request_status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status penerimaan
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value='not_yet'>
                                                            Belum ada
                                                        </SelectItem>
                                                        <SelectItem value='partial'>
                                                            Sebagian
                                                        </SelectItem>
                                                        <SelectItem value='full'>
                                                            Penuh
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='payment_method'
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-1'>
                                    <FormLabel>
                                        Metode pembayaran
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => {
                                            field.onChange(e)
                                            if (e == "cash") {
                                                setExpire(false)
                                                form.setValue("payment_expire", new Date())
                                            } else {
                                                setExpire(true)
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih metode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value='cash'>
                                                        Tunai
                                                    </SelectItem>
                                                    <SelectItem value='installment'>
                                                        Jatuh tempo
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-normal" />
                                </FormItem>
                            )}
                        />
                        {
                            isExpire && (
                                <FormField
                                    control={form.control}
                                    name='payment_expire'
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
                            )
                        }
                        <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                            <Loading isLoading={isLoading}>
                                Ubah
                            </Loading>
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateOrderForm
