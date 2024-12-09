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
import { UserPlus } from 'lucide-react';;
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Medicine } from '@models/medicines';
import { Input } from '@components/ui/input';
import TransactionSelect from './TransactionSelect';
import { Transaction } from '@models/transactions';
import { updatePaymentInstallment } from '@/actions/transaction';
import Loading from '@components/ui/loading';
import OrderTable from '../order/OrderTable';

export type ItemReceived = {
    medicine_id: number,
    received: number,
    order_medicine_id: number,
    medicine: Medicine,
    max_qty: number;
    min_qty: number;
    total_request: number
}

function UpdateInstallmentPayment() {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)
    const [order, setOrder] = useState<Transaction | null>(null)
    

    const receiptSchema = z.object({
        cash: z.number().min(0),
        id_transaction: z.string().min(1),
    })

    const form = useForm<z.infer<typeof receiptSchema>>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            cash: 0,
            id_transaction: ""
        },
    })


    const handleCreate = async (values: z.infer<typeof receiptSchema>) => {
        try {
            setLoading("loading")
            if (!order)
                throw new Error("Pilih order")
            const res = await updatePaymentInstallment(order.id, values.cash)
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

    console.log(order?.items);
    


    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="default">
                    Bayar Piutang
                    <UserPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='md:px-12'>
                <DrawerHeader>
                    <DrawerTitle>Pembayaran piutang</DrawerTitle>
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
                                                {order?.code_transaction ?? "Tidak ada data"}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Pembeli
                                            </TableCell>
                                            <TableCell>
                                                {order?.buyer ?? "Tidak ada data"}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                            <TableCell>
                                                {order?.transaction_status ?? "Tidak ada data"}
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
                        <OrderTable
                            items={order?.items.length ?
                                order.items.map(fo => ({
                                    medicineId: fo.medicine_id!,
                                    name: fo.medicine?.name!,
                                    price: fo.medicine.selling_price ?? 0,
                                    qty: fo.quantity ?? 0,
                                    stock: fo.medicine.stock ?? 0
                                })) : []
                            }
                            variant='transaction'
                            setItem={() => { }}
                        />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 p-6 bg-background shadow border-2 rounded-lg border-border">
                            <FormField
                                control={form.control}
                                name='id_transaction'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Cari Transaksi
                                        </FormLabel>
                                        <FormControl>
                                            <TransactionSelect setOrder={setOrder} {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='cash'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Uang pembayaran
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="delivery_name"
                                                placeholder=".."
                                                type="text"
                                                className="placeholder:opacity-50"
                                                {...field}
                                                onChange={(e) => { field.onChange(!isNaN(Number(e.target.value)) ? Number(e.target.value) : field.value) }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                            < Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                <Loading isLoading={isLoading}>
                                    Ubah
                                </Loading>
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer >
    )
}

export default UpdateInstallmentPayment
