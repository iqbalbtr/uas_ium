"use client"
import React, { SetStateAction } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Minus, Plus } from 'lucide-react'
import { ItemReceived } from './CreateReceiptForm'


function ReceiptOrderTable({
    items,
    setItem,
    isUpdate = false
}: {
    items: ItemReceived[],
    setItem: React.Dispatch<SetStateAction<ItemReceived[]>>,
    isUpdate: boolean
}) {


    function handleMutation(type: "plus" | "minus", medicine: ItemReceived) {
        if (type === "minus" && medicine.received === 0) return;
    
        if (!isUpdate && type === "plus" && (medicine.received + 1) > medicine.max_qty) return;
    
        if (isUpdate && type === "plus" && medicine.total_request - medicine.received  === 0) return;
    
        setItem((pv) =>
            pv.map((item) =>
                item.order_medicine_id === medicine.order_medicine_id
                    ? {
                          ...item,
                          received: type === "minus" ? item.received - 1 : item.received + 1,
                          ...(isUpdate && { max_qty: item.total_request - (type === "minus" ? item.received - 1 : item.received + 1) }),
                      }
                    : item
            )
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Item pesanan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>nama</TableHead>
                            <TableHead>Kode Obat</TableHead>
                            <TableHead>Jummlah di pesan</TableHead>
                            <TableHead>Jummlah belum di terima</TableHead>
                            <TableHead>Diterima</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                           items.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{++i}</TableCell>
                                    <TableCell>{fo.medicine.name}</TableCell>
                                    <TableCell>{fo.medicine.medicine_code}</TableCell>
                                    <TableCell>{fo.total_request}</TableCell>
                                    <TableCell>{fo.max_qty}</TableCell>
                                    <TableCell>{fo.received}</TableCell>
                                    <TableCell className='flex gap-2 items-center'>
                                        <Button onClick={() => handleMutation("plus", fo)} variant={"default"}><Plus /></Button>
                                        <Button onClick={() => handleMutation("minus", fo)} variant={"destructive"}><Minus /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    { items.length == 0 && (
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

export default ReceiptOrderTable
