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
import { LucideBriefcaseMedical } from 'lucide-react';
import { TextArea } from '@components/ui/textarea';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { CategoryMedicineSelect } from './CategoryMedicineSelect';
import { TypeMedicineSelect } from './TypeMedicineSelect';
import { createMedicine } from '@/actions/medicine';
import Loading from '@components/ui/loading';

function CreateMedicineForm({ handleFetch }: { handleFetch: () => Promise<void> }) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)

    const medicineSchema = z.object({
        name: z.string().min(2).max(255),
        active_ingredients: z.string().min(2).max(255),
        indication: z.string().min(2).max(255),
        purchase_price: z.number().min(0),
        selling_price: z.number().min(0),
        stock: z.number().min(0),
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
            name: "",
            active_ingredients: "",
            indication: "",
            purchase_price: 0,
            selling_price: 0,
            expired: 0,
            side_effect: "",
            stock: 0,
            medicine_code: "",
            medicine_type: "",
            medicine_category: "",
            dosage: "",
            min: 0,
            max: 0,
        },
    })


    const handleCreate = async (values: z.infer<typeof medicineSchema>) => {
        try {
            setLoading("loading")
            const res = await createMedicine({
                ...values,
                stock: values.stock
            }, { max: values.max, min: values.min });
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                setOpen(false)
                form.reset()
                handleFetch()
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
                    <LucideBriefcaseMedical />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='max-h-[100vh]'>
                <DrawerHeader>
                    <DrawerTitle className='text-center'>Tambah Obat</DrawerTitle>
                </DrawerHeader>

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
                                    <div className='grid grid-cols-2 gap-2 items-center'>
                                        <div className="">
                                            <FormField
                                                control={form.control}
                                                name='purchase_price'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Harga Beli
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="purchase_price"
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

                                        <div className="">
                                            <FormField
                                                control={form.control}
                                                name='selling_price'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-1'>
                                                        <FormLabel>
                                                            Harga Jual
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="selling_price"
                                                                placeholder="Harga jual.."
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
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name='stock'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel>
                                                        Stok
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
                                                            <TypeMedicineSelect value={field.value} onChange={field.onChange} />
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
                                                            <CategoryMedicineSelect value={field.value} onChange={field.onChange} />
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
                                                            Waktu kadaluarsa / Hari
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
                                <Loading isLoading={isLoading} type='line'>
                                    Tambah
                                </Loading>
                            </Button>
                        </form>
                    </Form>
                </div>

            </DrawerContent>
        </Drawer>
    )
}

export default CreateMedicineForm
