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
import {  getAllReceiptItemByIdOrder } from "@/actions/receipts";
import useFetch from "@hooks/use-fetch";
import Loading from "@components/ui/loading";

export default function DetailItemReceived({ id }: { id: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, refresh } = useFetch({
        url: async () => getAllReceiptItemByIdOrder(id),
        defaultValue: [],
        initialize: false
    })

    useEffect(() => {
        if (isOpen)
            refresh()
    }, [isOpen])


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
                                <TableHead>Total item diterima</TableHead>
                                <TableHead>Jumlah dipesan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((receipt) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{receipt.order_medicine?.medicine?.name}</TableCell>
                                    <TableCell>{receipt.order_medicine?.medicine?.medicine_code}</TableCell>
                                    <TableCell>{receipt.received}</TableCell>
                                    <TableCell>{receipt.order_medicine?.quantity}</TableCell>
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
