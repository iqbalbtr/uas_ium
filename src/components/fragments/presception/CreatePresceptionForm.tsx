"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { PackagePlus, UserPlus } from 'lucide-react';
import SearchMedicine from '@components/fragments/medicine/SearchMedicine';
import { Medicine } from '@models/medicines';
import { TextArea } from '@components/ui/textarea';
import PresciptionMedicineTable, { ItemPresciption } from './PresciptionMedicineTable';
import { createPresciption } from '@/actions/prescription';
import Loading from '@components/ui/loading';
import { Item } from '@/app/dashboard/kasir/page';
import { getRupiahFormat } from '@libs/utils';


function CreatePresceptionForm({ handleFetch }: { handleFetch: () => Promise<void> }) {

    const { isLoading, setLoading } = useLoading()
    const [items, setItems] = useState<ItemPresciption[]>([])
    const [isOpen, setOpen] = useState(false)
    const [effectted, setEffect] = useState(false)
    const [total, setTotal] = useState(0)


    function handleAdd(val: Item, qty: number) {

        const isExist = items.find(fo => fo.id == val.id)

        if (!qty)
            return toast({
                title: "Error",
                description: "Jumlah minimal 1",
                variant: "destructive"
            })

        if (isExist?.qty! + qty > val.stock)
            return toast({
                title: "Error",
                description: "Batas jumlah melebihi stock",
                variant: "destructive"
            })


        setItems(prevItems => {
            if (isExist) {
                return prevItems.map((item) =>
                    item.id === isExist.id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                return [
                    {
                        id: val.id,
                        name: val.name,
                        price: val.selling_price,
                        qty: qty,
                        stock: val.stock,
                        notes: ""
                    },
                    ...prevItems,
                ];
            }
        });
    }


    const orderSchema = z.object({
        name: z.string().min(3).max(55),
        code_presciption: z.string().min(2).max(55),
        doctor_name: z.string().min(2).max(55),
        instructions: z.string().min(2),
        description: z.string().min(0),
        discount: z.number().min(0).max(100),
        fee: z.number().min(0),
        tax: z.number().min(0).max(100),
    })

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            code_presciption: "",
            description: "",
            discount: 0,
            doctor_name: "",
            fee: 0,
            instructions: "",
            name: "",
            tax: 0
        },
    })

    const tax = form.getValues("tax")
    const disc = form.getValues("discount")


    useEffect(() => {
        const total = items.reduce((acc, pv) => acc += (pv.qty * pv.price), 0)
        setTotal(total - ((disc / 100) * total) + ((tax / 100) * total))
    }, [items, disc, tax, effectted])


    const handleCreate = async (values: z.infer<typeof orderSchema>) => {
        try {
            setLoading("loading")
            const res = await createPresciption({
                description: values.description,
                discount: values.discount,
                doctor: values.doctor_name,
                fee: values.fee,
                intructions: values.instructions,
                name: values.name,
                tax: values.tax,
                code_presciption: values.code_presciption
            }, items)
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                setOpen(false)
                form.reset()
                setItems([])
                handleFetch && handleFetch()
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
                    Buat racikan
                    <PackagePlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='md:px-12'>
                <DrawerHeader>
                    <DrawerTitle>Racik obat</DrawerTitle>
                </DrawerHeader>

                <div className='grid md:grid-cols-2 gap-6'>
                    <SearchMedicine variant='presciption' handleAdd={handleAdd} />
                    <div>
                        <h1 className='text-xl py-2 font-bold px-3'>{getRupiahFormat(total)}</h1>
                        <PresciptionMedicineTable items={items} setItem={setItems} />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 p-6 bg-background shadow border-2 rounded-lg border-border mt-6">
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Nama
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    placeholder="nama.."
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
                                    name='doctor_name'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Nama Dokter
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="doctor_name"
                                                    placeholder="Nama dokter.."
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
                                    name='code_presciption'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Kode Racikan
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
                                <div className='grid grid-cols-2 gap-2 items-center'>
                                    <FormField
                                        control={form.control}
                                        name='discount'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-col gap-1'>
                                                <FormLabel>
                                                    Diskon %
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="discount"
                                                        placeholder="discount.."
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
                                    <FormField
                                        control={form.control}
                                        name='fee'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-col gap-1'>
                                                <FormLabel>
                                                    Biaya Tambahan / Rupiah
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="discount"
                                                        placeholder="discount.."
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
                                <FormField
                                    control={form.control}
                                    name='tax'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Pajak %
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="tax"
                                                    placeholder="tax.."
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
                                <FormField
                                    control={form.control}
                                    name='description'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Deskripsi
                                            </FormLabel>
                                            <FormControl>
                                                <TextArea
                                                    rows={4}
                                                    id="tax"
                                                    placeholder="Deskripsi .."
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
                                    name='instructions'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Instruksi
                                            </FormLabel>
                                            <FormControl>
                                                <TextArea
                                                    rows={4}
                                                    id="tax"
                                                    placeholder="Instruksi .."
                                                    className="placeholder:opacity-50"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-normal" />
                                        </FormItem>
                                    )}
                                />

                                <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                    <Loading isLoading={isLoading}>
                                        Buat
                                    </Loading>
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>


            </DrawerContent>
        </Drawer>
    )
}

export default CreatePresceptionForm
