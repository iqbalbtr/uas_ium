"use client"
import { Button } from '@components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn, getDateFormat } from '@libs/utils';
import { Calendar } from '@components/ui/calendar';
import { OrderSelect } from '../order/OrderSelect';
import { Table, TableBody, TableCell,  TableRow } from '@components/ui/table';
import { Order } from '@models/orders';
import { createReceipt } from '@/actions/receipts';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

function CreateReceiptForm() {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)
    const [method, setMethod] = useState(false);
    const [order, setOrder] = useState<Order | null>(null)

    const receiptSchema = z.object({
        payment_method: z.enum(["cash", "installment", ""]),
        payment_expired: z.date().optional(),
        receipt_status: z.enum(["accepted", "rejected", "pending", ""]),
        request_status: z.enum(["full", "partial", ""]),
        order_code: z.string().min(0).max(100),
    })

    const form = useForm<z.infer<typeof receiptSchema>>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            payment_expired: new Date(),
            payment_method: "",
            receipt_status: "",
            request_status: "",
            order_code: ""
        },
    })


    const handleCreate = async (values: z.infer<typeof receiptSchema>) => {
        try {
            setLoading("loading")
            const res = await createReceipt(
                values.payment_method as "cash" | "installment",
                values.receipt_status as "accepted" | "rejected" | "pending",
                values.request_status as "full" | "partial",
                values.order_code,
                values.payment_expired
            );
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                form.reset()
                setOrder(null)
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
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="default">
                    Tambah
                    <UserPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='md:px-12'>
                <DrawerHeader>
                    <DrawerTitle>Penerimaan Pesanan</DrawerTitle>
                </DrawerHeader>

                <div className='grid grid-cols-2 gap-4'>
                    <Card className='h-fit'>
                        <CardHeader>
                            <CardTitle>
                                Data Pesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>

                                    <TableRow>
                                        <TableCell>
                                            Kode
                                        </TableCell>
                                        <TableCell>
                                            {order?.order_code ?? "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Supplier
                                        </TableCell>
                                        <TableCell>
                                            {order?.supplier ?? "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Status
                                        </TableCell>
                                        <TableCell>
                                            {order?.order_status ?? "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Diskon
                                        </TableCell>
                                        <TableCell>
                                            {order?.discount ? String(order.discount) + "%" : "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Pajak
                                        </TableCell>
                                        <TableCell>
                                            {order?.tax ? String(order.tax) + "%" : "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            Rp {order?.total ?? "Tidak ada data"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 p-6 bg-background shadow border-2 rounded-lg border-border">
                            <FormField
                                control={form.control}
                                name='order_code'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Cari Pemesanan
                                        </FormLabel>
                                        <FormControl>
                                            <OrderSelect setOrder={setOrder} {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='payment_method'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Metode pembayaran
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value} onValueChange={(e) => {
                                                    field.onChange(e)
                                                    if (e == "installment") {
                                                        setMethod(true)
                                                    } else {
                                                        setMethod(false)
                                                        form.setValue("payment_expired", new Date())
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih metode.." />
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
                            <FormField
                                control={form.control}
                                name='request_status'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Status Pesanan
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value='full'>
                                                            Penuh
                                                        </SelectItem>
                                                        <SelectItem value='partial'>
                                                            Sebagian
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='receipt_status'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Status Penerimaan
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status penerimaan.." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value='accepted'>
                                                            Terima
                                                        </SelectItem>
                                                        <SelectItem value='rejected'>
                                                            Tolak
                                                        </SelectItem>
                                                        <SelectItem value='pending'>
                                                            Tangguhkan
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
                                method && (
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
                                )
                            }
                            < Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                {isLoading == "loading" ? "Loading" : "Pesan"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer >
    )
}

export default CreateReceiptForm
