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
import { CalendarIcon, UserPlus } from 'lucide-react';
import OrderTable from '@components/fragments/order/OrderTable';
import SearchMedicine from '@components/fragments/medicine/SearchMedicine';
import { Medicine } from '@models/medicines';
import { createOrder } from '@/actions/order';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Calendar } from '@components/ui/calendar';
import { cn, getDateFormat } from '@libs/utils';
import Loading from '@components/ui/loading';
import { Item } from '@/app/dashboard/kasir/page';


function CreateOrderForm({ handleFetch }: { handleFetch: () => Promise<void> }) {

    const { isLoading, setLoading } = useLoading()
    const [items, setItems] = useState<Item[]>([])
    const [isOpen, setOpen] = useState(false)
    const [effectted, setEffect] = useState(false)
    const [total, setTotal] = useState(0)
    const [isExpire, setExpire] = useState(false)


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
                        ...val,
                        qty: qty
                    },
                    ...prevItems,
                ];
            }
        })
    }


    const orderSchema = z.object({
        supplier: z.string().min(3).max(55),
        order_status: z.string().min(2).max(255),
        tax: z.number().min(0).max(100),
        discount: z.number().min(0).max(100),
        payment_method: z.enum(["cash", "installment", ""]),
        payment_expire: z.date().optional()
    })

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            supplier: "",
            discount: 0,
            tax: 0,
            order_status: "",
            payment_method: "",
            payment_expire: new Date()
        },
    })

    const tax = form.getValues("tax")
    const disc = form.getValues("discount")


    useEffect(() => {
        const total = items.reduce((acc, pv) => acc += (pv.qty * pv.purchase_price), 0)
        setTotal(total - ((disc / 100) * total) + ((tax / 100) * total))
    }, [items, disc, tax, effectted])


    const handleCreate = async (values: z.infer<typeof orderSchema>) => {
        try {
            setLoading("loading")
            const res = await createOrder(items, { ...values, payment_method: values.payment_method as any, orderStatus: values.order_status as "cancelled" | "completed" | "pending" });
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
                    Tambah
                    <UserPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='md:px-12'>
                <DrawerHeader>
                    <DrawerTitle>Pesan obat</DrawerTitle>
                </DrawerHeader>

                <div className='grid md:grid-cols-2 gap-6'>
                    <SearchMedicine variant='order' handleAdd={handleAdd} />
                    <div>
                        <Input className='mb-6' disabled value={`Rp. ${total}`} />
                        <OrderTable items={items} setItem={setItems} variant='receipt' />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 p-6 bg-background shadow border-2 rounded-lg border-border mt-6">
                                <FormField
                                    control={form.control}
                                    name='supplier'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
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
                                <FormField
                                    control={form.control}
                                    name='discount'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Diskon
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
                                    name='tax'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
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
                                                    onChange={(e) => { field.onChange(!isNaN(Number(e.target.value)) ? Number(e.target.value) : field.value); setEffect(pv => !pv) }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-normal" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='order_status'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-1'>
                                            <FormLabel>
                                                Status Pemesanan
                                            </FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value='cancelled'>
                                                                Dibatalkan
                                                            </SelectItem>
                                                            <SelectItem value='pending'>
                                                                Di Tangguhkan
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
                                        Pesan
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

export default CreateOrderForm
