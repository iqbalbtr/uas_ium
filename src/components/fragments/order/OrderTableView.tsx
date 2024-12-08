"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Order } from '@models/orders';
import { TableView } from '@models/view';
import React from 'react'
import UpdateOrderForm from './UpdateOrderForm';
import DeleteOrder from './DeleteOrder';
import { getDateFormat, getRupiahFormat } from '@libs/utils';
import TableLayout from '@components/layouts/TableLayout';
import Loading from '@components/ui/loading';

function OrderTableMain({
    data,
    isLoading,
    handleFetch
}: TableView<Order>) {


    return (
        <TableLayout>
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
                        <TableHead>Metode Pembayaram</TableHead>
                        <TableHead>Status Pembayaram</TableHead>
                        <TableHead>Tanggal jatuh tempo</TableHead>
                        <TableHead>Pajak</TableHead>
                        <TableHead>Diskon</TableHead>
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
                                <TableCell>{fo.payment_status}</TableCell>
                                <TableCell>{fo.payment_method == "installment" ? getDateFormat(fo.payment_expired) : "Tidak ada"}</TableCell>
                                <TableCell>{fo.tax}</TableCell>
                                <TableCell>{fo.discount}</TableCell>
                                <TableCell>{getRupiahFormat(fo.total)}</TableCell>
                                <TableCell>
                                    <DeleteOrder data={fo} handleFetch={handleFetch} />
                                    <UpdateOrderForm handleFetch={handleFetch} data={fo} />
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
                    ) : data.length == 0 && (
                        <TableCaption className='w-full '>
                            Data kosong
                        </TableCaption>
                    )
                }
            </Table>
        </TableLayout>
    )
}

export default OrderTableMain
