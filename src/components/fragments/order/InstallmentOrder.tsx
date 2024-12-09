"use client"
import { getOrder } from '@/actions/order';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import usePagination from '@hooks/use-paggination';
import { getDateFormat, getRupiahFormat } from '@libs/utils';
import { Order } from '@models/orders';
import React, { useEffect, useState } from 'react'
import UpdateStatusPayment from './UpdateStatusPayment';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import Loading from '@components/ui/loading';
import useFetch from '@hooks/use-fetch';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';

function InstallmentOrder() {

    const [orders, setOrder] = useState<Order[]>([])
    const [isOpen, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [data, setData] = useState<Order[]>([])
    const { isLoading, setLoading } = useLoading()

    const getData = async () => {
        setLoading("loading");
        try {
            const get = await getOrder(1, 5, input, undefined, "pending")
            const data = get?.data || [];
            setData(data as Order[])
            setLoading("success");
        } catch (error: any) {
            console.error("Error fetching roles:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setLoading("error");
        }
    };

    const HandleSearch = (() => {
        let timeout: NodeJS.Timeout | null = null;
        return () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                getData();
            }, 700);
        };
    })();
    
    useEffect(() => {
        getData()
    }, [isOpen])

    useEffect(() => {
        HandleSearch()
    }, [input])

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    Cek pembayaran
                </Button>
            </DrawerTrigger>
            <DrawerContent className='px-24 pb-16'>
                <DrawerHeader>
                    <DrawerTitle>List pembayaran</DrawerTitle>
                    <DrawerDescription>list pembayaran yang belum di bayar</DrawerDescription>
                </DrawerHeader>
                <div className='max-w-md flex items-center gap-2'>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button>Cari</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Kode</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Total Item</TableHead>
                            <TableHead>Tanggal Pemesanan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Status Penerimaan</TableHead>
                            <TableHead>Metode Pembayaran</TableHead>
                            <TableHead>Tanggal jatuh tempo</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{fo.order_code}</TableCell>
                                    <TableCell>{fo.supplier}</TableCell>
                                    <TableCell>{fo.total_item}</TableCell>
                                    <TableCell>{getDateFormat(fo.order_date)}</TableCell>
                                    <TableCell>{fo.order_status}</TableCell>
                                    <TableCell>{fo.request_status}</TableCell>
                                    <TableCell>{fo.payment_method}</TableCell>
                                    <TableCell>{fo.payment_method == "installment" ? getDateFormat(fo.payment_expired) : "Tidak ada"}</TableCell>
                                    <TableCell>{getRupiahFormat(fo.total)}</TableCell>
                                    <TableCell>
                                        <UpdateStatusPayment data={fo} handleFetch={getData} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    {
                        isLoading == "loading" ? (
                            <TableCaption className='w-full '>
                                <Loading type='loader' isLoading='loading' />
                            </TableCaption>
                        ) : orders.length == 0 && (
                            <TableCaption className='w-full '>
                                Data kosong
                            </TableCaption>
                        )
                    }
                </Table>
            </DrawerContent>
        </Drawer>
    )
}

export default InstallmentOrder
