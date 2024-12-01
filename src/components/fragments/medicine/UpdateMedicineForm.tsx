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
import {Pen } from 'lucide-react';
import { TextArea } from '@components/ui/textarea';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { CategoryMedicineSelect } from './CategoryMedicineSelect';
import { TypeMedicineSelect } from './TypeMedicineSelect';
import {  updateMedicine } from '@/actions/medicine';
import { TableMutation } from '@models/view';
import { Medicine } from '@models/medicines';

function UpdateMedicineForm({ data, handleFetch }: TableMutation<Medicine>) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)

    const medicineSchema = z.object({
        name: z.string().min(2).max(255),
        active_ingredients: z.string().min(2).max(255),
        indication: z.string().min(2).max(255),
        price: z.number().min(0),
        min: z.number().min(0),
        expired: z.number().min(0),
        side_effect: z.string().min(0),
        max: z.number().min(0),
        dosage: z.string().min(1).max(255),
        medicine_code: z.string().min(1).trim(),
        medicine_category: z.string().min(1).trim(),
        medicine_type: z.string().min(1).trim(),
    })

    const form = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            name: data.name,
            active_ingredients: data.active_ingredients,
            indication: data.indication,
            price: data.price,
            expired: data.expired,
            side_effect: data.side_effect,
            // stock: data.stock,
            medicine_code: data.medicine_code,
            medicine_type: data.medicine_type,
            medicine_category: data.medicine_category,
            dosage: data.dosage,
            min: data.medicine_reminder?.min_stock,
            max: data.medicine_reminder?.max_stock,
        },
    })


    const handleCreate = async (values: z.infer<typeof medicineSchema>) => {
        try {
            setLoading("loading")
            const res = await updateMedicine(
                data.id, values, { max: values.max, min: values.min });
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                setOpen(false)
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
                <Button variant="ghost">
                    <Pen />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='max-h-[100vh]'>
                <DrawerHeader>
                    <DrawerTitle className='text-center'>Ubah Obat</DrawerTitle>
                </DrawerHeader>

                <DrawerClose className='w-fit self-end' asChild>
                    <Button>
                        Tutup
                    </Button>
                </DrawerClose>

                <div className='overflow-y-auto md:px-32 p-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="">
                            <div className='grid md:grid-cols-2 items-center gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="name"
                                                            placeholder="name.."
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
                                            name='price'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel>
                                                        Harga
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="price"
                                                            placeholder="Harga.."
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
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name='max'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Max
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="max"
                                                                placeholder="Maksimal stock.."
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
                                                name='min'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Min
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="min"
                                                                placeholder="Minimal stock.."
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
                                    </div>
                                </div>




                                <div className='flex flex-col gap-2'>
                                    <div className='grid grid-cols-2 gap-2 items-center'>
                                        <div className="">
                                            <FormField
                                                control={form.control}
                                                name='medicine_type'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Jenis
                                                        </FormLabel>
                                                        <FormControl>
                                                            <TypeMedicineSelect {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-red-500 font-normal" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className=''>
                                            <FormField
                                                control={form.control}
                                                name='medicine_category'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Kategori
                                                        </FormLabel>
                                                        <FormControl>
                                                            <CategoryMedicineSelect {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-red-500 font-normal" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name='medicine_code'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel>
                                                        Kode
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="medicine_code"
                                                            placeholder="Kode obat.."
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
                                                name='dosage'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Dosis
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="dosage"
                                                                placeholder="Dosis obat.."
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
                                                name='expired'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Waktu kadaluarsa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="expired"
                                                                placeholder="kadaluarsa per hari.."
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
                                    </div>
                                </div>


                            </div>

                            <div className='grid grid-cols-2 gap-3 pb-3'>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name='active_ingredients'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Bahan aktif
                                                </FormLabel>
                                                <FormControl>
                                                    <TextArea
                                                        id="active_ingredients"
                                                        placeholder="Bahan aktif"
                                                        className="placeholder:opacity-50"
                                                        {...field}
                                                        rows={3}
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
                                        name='indication'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Indikasi
                                                </FormLabel>
                                                <FormControl>
                                                    <TextArea
                                                        id="indication"
                                                        placeholder="indikasi.."
                                                        className="placeholder:opacity-50"
                                                        {...field}
                                                        rows={3}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 font-normal" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='space-y-2 pb-4'>
                                <FormField
                                    control={form.control}
                                    name='side_effect'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Efek samping
                                            </FormLabel>
                                            <FormControl>
                                                <TextArea
                                                    id="side_effect"
                                                    placeholder="Efek samping.."
                                                    className="placeholder:opacity-50"
                                                    {...field}
                                                    rows={5}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-normal" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button disabled={isLoading == "loading"} type='submit' className="w-full">
                                {isLoading == "loading" ? "Loading" : "Ubah"}
                            </Button>
                        </form>
                    </Form>
                </div>

            </DrawerContent>
        </Drawer>
    )
}

export default UpdateMedicineForm
