"use client"
import { getOrder } from '@/actions/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import usePagination from '@hooks/use-paggination';
import { getDateFormat, getRupiahFormat } from '@libs/utils';
import { Order } from '@models/orders';
import React, { useState } from 'react'
import UpdateStatusPayment from './UpdateStatusPayment';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer';
import { Button } from '@components/ui/button';

function InstallmentOrder() {

    const [orders, setOrder] = useState<Order[]>([])

    const { handleFetch, Paggination, isLoading } = usePagination({
        handleGet: async (page, setPage) => {
            const get = await getOrder(1, 10, undefined, undefined, "pending");
            if (get) {
                setOrder(get.data as Order[]);
                setPage(get.pagging);
            }
        },
        initialize: true,
    });



    return (
        <Drawer>
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
                        {isLoading !== "loading" ?
                            orders.map((fo, i) => (
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
                                        <UpdateStatusPayment data={fo} handleFetch={handleFetch} />
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell>Loading</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>

                <Paggination />
            </DrawerContent>
        </Drawer>
    )
}

export default InstallmentOrder
