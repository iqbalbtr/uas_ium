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
import { useNumberPage } from '@hooks/use-paggination';
import { getPaymentClass, getRequestClass, getStatusTransClass } from '@libs/style';

function OrderTableMain({
    data,
    isLoading,
    handleFetch
}: TableView<Order>) {

    const { getNumber } = useNumberPage({})

    return (
        <TableLayout>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead className='w-[170px]'>Kode</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Total Item</TableHead>
                        <TableHead>Tanggal Pemesanan</TableHead>
                        <TableHead className='w-[170px]'>Status</TableHead>
                        <TableHead className='w-[120px]'>Status Penerimaan</TableHead>
                        <TableHead className='w-[120px]'>Metode Pembayaram</TableHead>
                        <TableHead className='w-[120px]'>Status Pembayaram</TableHead>
                        <TableHead className='w-[100px]'>Jatuh tempo</TableHead>
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
                                <TableCell>{getNumber(i)}</TableCell>
                                <TableCell>{fo.order_code}</TableCell>
                                <TableCell>{fo.supplier}</TableCell>
                                <TableCell>{fo.total_item}</TableCell>
                                <TableCell>{getDateFormat(fo.order_date)}</TableCell>
                                <TableCell><span className={getStatusTransClass(fo.order_status).class}>{getStatusTransClass(fo.order_status).label}</span></TableCell>
                                <TableCell><span className={getRequestClass(fo.request_status).class}>{getRequestClass(fo.request_status).label}</span></TableCell>
                                <TableCell><span className={getPaymentClass(fo.payment_method).class}>{getPaymentClass(fo.payment_method).label}</span></TableCell>
                                <TableCell><span className={getStatusTransClass(fo.payment_status).class}>{getStatusTransClass(fo.payment_status).label}</span></TableCell>
                                <TableCell>{fo.payment_method == "installment" ? getDateFormat(fo.payment_expired) : "Tidak ada"}</TableCell>
                                <TableCell>{fo.tax}%</TableCell>
                                <TableCell>{fo.discount}%</TableCell>
                                <TableCell>{getRupiahFormat(fo.total)}</TableCell>
                                <TableCell className='flex gap-2 items-center'>
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
