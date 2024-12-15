"use client"
import React, { SetStateAction } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Minus, Plus } from 'lucide-react'
import { Item } from '@/app/dashboard/kasir/page'
import { getRupiahFormat } from '@libs/utils'


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
                            <TableHead>Harga</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Sub Total</TableHead>
                            {!disabled && <TableHead></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length > 0 ? (
                            items.map((fo, index) => {
                                const price = variant === "transaction" ? fo.selling_price : fo.purchase_price;
                                return (
                                    <TableRow key={fo.id || index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{fo.name}</TableCell>
                                        <TableCell>{price}</TableCell>
                                        <TableCell>{fo.qty}</TableCell>
                                        <TableCell>{getRupiahFormat(fo.qty * price)}</TableCell>
                                        {!disabled && (
                                            <TableCell className='flex gap-2 items-center'>
                                                <Button onClick={() => handleMutation("plus", fo)} variant={"default"}>
                                                    <Plus />
                                                </Button>
                                                <Button onClick={() => handleMutation("minus", fo)} variant={"destructive"}>
                                                    <Minus />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Data kosong
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </CardContent>
        </Card>
    )
}

export default OrderTable
