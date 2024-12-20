"use client"
import { getLatestTransaction } from '@/actions/dashboard'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Loading from '@components/ui/loading'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import useFetch from '@hooks/use-fetch'
import { getStatusTransClass } from '@libs/style'
import { getRupiahFormat } from '@libs/utils'
import React from 'react'

function RecentTransaction() {

    const { data, isLoading } = useFetch({
        defaultValue: [],
        url: getLatestTransaction
    })

    return (
        <Card className="col-span-4 h-fit">
            <CardHeader>
                <CardTitle>Riwayat Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status Pembayaran</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{fo.code_transaction}</TableCell>
                                    <TableCell>{fo.buyer}</TableCell>
                                    <TableCell>{getRupiahFormat(fo.total)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusTransClass(fo.payment_status as any).class}>{getStatusTransClass(fo.payment_status as any).label}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusTransClass(fo.transaction_status as any).class}>{getStatusTransClass(fo.transaction_status as any).label}</Badge>
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
            </CardContent>
        </Card>
    )
}

export default RecentTransaction
