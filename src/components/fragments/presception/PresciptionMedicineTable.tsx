"use client"
import React, { SetStateAction } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Minus, Plus } from 'lucide-react'
import { Item } from '@/app/dashboard/kasir/page'
import PresciptionMedicineNote from './PresciptionMedicineNote'
import { getRupiahFormat } from '@libs/utils'

export type ItemPresciption = {
    id: number;
    qty: number;
    name: string;
    price: number;
    notes: string;
    presciption_medicine_id?: number
}

function PresciptionMedicineTable({
    items,
    setItem,
}: {
    items: ItemPresciption[],
    setItem: React.Dispatch<SetStateAction<ItemPresciption[]>>
}) {

    function handleMutation(type: "plus" | "minus", medicine: ItemPresciption) {

        if (type == "minus" && medicine.qty <= 1)
            return setItem(pv => pv.filter(fo => fo.id !== medicine.id))

        setItem(pv => pv.map((item) =>
            item.id === medicine.id
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
                            <TableHead>Catatan</TableHead>
                            <TableHead>Sub total</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            items.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{++i}</TableCell>
                                    <TableCell>{fo.name}</TableCell>
                                    <TableCell>{fo.price}</TableCell>
                                    <TableCell>{fo.qty}</TableCell>
                                    <TableCell><PresciptionMedicineNote item={fo} setItem={setItem} /></TableCell>
                                    <TableCell>{getRupiahFormat(fo.qty * fo.price)}</TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell className='flex gap-2 items-center'>
                                        <Button onClick={() => handleMutation("plus", fo)} variant={"default"}><Plus /></Button>
                                        <Button onClick={() => handleMutation("minus", fo)} variant={"destructive"}><Minus /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>

                    {
                        items.length == 0 && (
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

export default PresciptionMedicineTable
