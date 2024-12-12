"use client"
import { Button } from '@components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { OrderSelect } from '../order/OrderSelect';
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table';
import { Order } from '@models/orders';
import { createReceipt } from '@/actions/receipts';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Medicine } from '@models/medicines';
import ReceiptOrderTable from './ReceiptOrderTable';
import { Input } from '@components/ui/input';
import Loading from '@components/ui/loading';

export type ItemReceived = {
    medicine_id: number,
    received: number,
    order_medicine_id: number,
    medicine: Medicine,
    max_qty: number;
    min_qty: number;
    total_request: number
}

function CreateReceiptForm({ handlefetch }: { handlefetch: () => Promise<void> }) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)
    const [order, setOrder] = useState<Order | null>(null)
    const [received, setReceived] = useState<ItemReceived[]>([])

    const receiptSchema = z.object({
        receipt_status: z.enum(["accepted", "rejected", "pending", ""]),
        order_code: z.string().min(1).max(100),
        delivery_name: z.string().min(3).max(100),
    })

    const form = useForm<z.infer<typeof receiptSchema>>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            receipt_status: "",
            order_code: "",
            delivery_name: "guest"
        },
    })


    const handleCreate = async (values: z.infer<typeof receiptSchema>) => {
        try {
            setLoading("loading")
            const res = await createReceipt(
                values.order_code,
                values.delivery_name,
                values.receipt_status as "accepted" | "rejected" | "pending",
                received.filter(fo => fo.received),
            );
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                form.reset()
                setOrder(null)
                setOpen(false)
                handlefetch()
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


    useEffect(() => {
        if (!order)
            return setReceived([])

        const payload: ItemReceived[] = order.order_medicines.map(fo => ({
            total_request: fo.quantity,
            max_qty: fo.quantity - fo.received_total,
            medicine_id: fo.medicine_id!,
            min_qty: 0,
            received: fo.quantity - fo.received_total,
            medicine: fo.medicine,
            order_medicine_id: fo.id
        }))

        setReceived(payload)
    }, [order])


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

                <div className='grid md:grid-cols-2 gap-4 overflow-y-scroll'>
                    <div className='flex gap-2 flex-col'>
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
                        <ReceiptOrderTable isUpdate={false} items={received} setItem={setReceived} />
                    </div>

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
                                name='delivery_name'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Nama Pengirirm
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="delivery_name"
                                                placeholder="Nama pengirirm.."
                                                type="text"
                                                className="placeholder:opacity-50"
                                                {...field}
                                            />
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
                            <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                <Loading isLoading={isLoading}>
                                    Terima
                                </Loading>
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer >
    )
}

export default CreateReceiptForm
