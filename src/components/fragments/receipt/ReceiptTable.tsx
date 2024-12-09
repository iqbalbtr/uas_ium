"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React from 'react'
import { TableView } from '@/model/view';
import { Receipt } from '@models/receipts';
import DeleteReceipt from './DeleteReceipt';
import UpdateReceiptForm from './UpdateReceiptForm';
import TableLayout from '@components/layouts/TableLayout';
import Loading from '@components/ui/loading';
import { useNumberPage } from '@hooks/use-paggination';


function ReceiptTable({
    data,
    isLoading,
    handleFetch
}: TableView<Receipt>) {

    const { getNumber } = useNumberPage({})

    return (
        <TableLayout>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Kode</TableHead>
                        <TableHead>Pengirim</TableHead>
                        <TableHead>Kode Pesanan</TableHead>
                        <TableHead>Status Penerimaan</TableHead>
                        <TableHead>Total item</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.map((fo, i) => (
                            <TableRow key={i}>
                                <TableCell>{getNumber(i)}</TableCell>
                                <TableCell>{fo.receipt_code}</TableCell>
                                <TableCell>{fo.delivery_name}</TableCell>
                                <TableCell>{fo.order.order_code}</TableCell>
                                <TableCell>{fo.receipt_status}</TableCell>
                                <TableCell>{fo.total_received_item}</TableCell>
                                <TableCell>
                                    <DeleteReceipt data={fo} handleFetch={handleFetch} />
                                    <UpdateReceiptForm data={fo} handleFetch={handleFetch} />
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

export default ReceiptTable
