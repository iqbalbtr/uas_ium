"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllReceiptByIdOrder, getAllReceiptItemByIdOrder, getReceipt, getReceiptById } from "@/actions/receipts";
import { Receipt, ReceiptMedicine } from "@models/receipts";
import { getAllMedicineOrderById, getOrderMedicineById } from "@/actions/order";
import { OrderMedicine } from "@models/orders";
import useFetch from "@hooks/use-fetch";
import Loading from "@components/ui/loading";

export default function DetailItemOrder({ id }: { id: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, refresh } = useFetch({
        url: async () => getAllMedicineOrderById(id),
        defaultValue: [],
        initialize: false
    })

    useEffect(() => {
        if(isOpen)
            refresh()
    },[isOpen])

    return (
        <div className="flex items-center justify-center ">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Details</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Data penerimaan</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Kode Obat</TableHead>
                                <TableHead>Jumlah dipesan</TableHead>
                                <TableHead>Jumlah diterima</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Sub total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((receipt) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{receipt.medicine?.name}</TableCell>
                                    <TableCell>{receipt.medicine?.medicine_code}</TableCell>
                                    <TableCell>{receipt.quantity}</TableCell>
                                    <TableCell>{receipt.received_total}</TableCell>
                                    <TableCell>{receipt.price}</TableCell>
                                    <TableCell>{receipt.sub_total}</TableCell>
                                </TableRow>
                            ))}
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
                </DialogContent>
            </Dialog>
        </div>
    );
}
