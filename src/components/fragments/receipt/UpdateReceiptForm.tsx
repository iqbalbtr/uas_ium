"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, {  useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import {  UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { TableMutation } from '@models/view';
import { Receipt } from '@models/receipts';
import { updateReceipt } from '@/actions/receipts';
import ReceiptOrderTable from './ReceiptOrderTable';
import { ItemReceived } from './CreateReceiptForm';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import Loading from '@components/ui/loading';

export type UpdateItemReceived = ItemReceived & { receipt_medicine_id?: number }


function UpdateReceiptForm({ data, handleFetch }: TableMutation<Receipt>) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)
    const [items, setItem] = useState<UpdateItemReceived[]>(data.receipt_medicines.map(fo => ({
        receipt_medicine_id: fo.id,
        total_request: fo.order_medicine.quantity,
        max_qty: fo.order_medicine.quantity - fo.received,
        medicine_id: fo.order_medicine.medicine_id!,
        min_qty: 0,
        received: fo.received,
        medicine: fo.order_medicine.medicine,
        order_medicine_id: fo.order_medicine.id
    })))

    const userSchema = z.object({
        receipt_status: z.enum(["accepted", "rejected", "pending", ""]),
        delivery_name: z.string().min(2).max(55)
    })


    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            receipt_status: data.receipt_status as any,
            delivery_name: data.delivery_name
        },
    })



    const handleCreate = async (values: z.infer<typeof userSchema>) => {
        try {
            setLoading("loading")
            const res = await updateReceipt(
                data.id,
                {
                    order_id: data.order_id,
                    receipt_status: values.receipt_status as any,
                    delivery_name: values.delivery_name
                },
                items
            );
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
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost">
                    <UserPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='px-24'>
                <DrawerHeader>
                    <DrawerTitle>Tambah User</DrawerTitle>
                </DrawerHeader>

                <div className='grid md:grid-cols-2 gap-3'>
                    <div>
                        <ReceiptOrderTable isUpdate items={items} setItem={setItem} />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="">
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name='delivery_name'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Nama pengirirm
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="Delivery name"
                                                    placeholder="Nama pengirim.."
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
                            </div>
                            <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                <Loading isLoading={isLoading}>
                                    Ubah
                                </Loading>
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default UpdateReceiptForm
