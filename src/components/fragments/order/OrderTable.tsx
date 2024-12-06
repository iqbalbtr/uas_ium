"use client"
import React, { SetStateAction } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Minus, Plus } from 'lucide-react'
import { Item } from '@/app/dashboard/kasir/page'


function OrderTable({
    items,
    setItem,
    variant = "transaction",
    disabled
}: {
    items: Item[],
    setItem: React.Dispatch<SetStateAction<Item[]>>
    variant: "receipt" | "transaction"
    disabled?: boolean
}) {

    function handleMutation(type: "plus" | "minus", medicine: Item) {

        if (variant == "transaction" && type == "plus" && medicine.stock - (medicine.qty + 1) < 0)
            return

        if (type == "minus" && medicine.qty <= 1)
            return setItem(pv => pv.filter(fo => fo.medicineId !== medicine.medicineId))

        setItem(pv => pv.map((item) =>
            item.medicineId === medicine.medicineId
                ? { ...item, qty: type == "minus" ? --item.qty : ++item.qty }
                : item
        ))
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
                            <TableHead>Nama</TableHead>
                            <TableHead>harga</TableHead>
                            <TableHead>jumlah</TableHead>
                            <TableHead>Sub total</TableHead>
                            {!disabled && <TableHead></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            items.length ? items.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{++i}</TableCell>
                                    <TableCell>{fo.name}</TableCell>
                                    <TableCell>{fo.price}</TableCell>
                                    <TableCell>{fo.qty}</TableCell>
                                    <TableCell>{fo.qty * fo.price}</TableCell>
                                    {!disabled && (
                                        <TableCell className='flex gap-2 items-center'>
                                            <Button onClick={() => handleMutation("plus", fo)} variant={"default"}><Plus /></Button>
                                            <Button onClick={() => handleMutation("minus", fo)} variant={"destructive"}><Minus /></Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell>Data tidak ditemukan</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default OrderTable
