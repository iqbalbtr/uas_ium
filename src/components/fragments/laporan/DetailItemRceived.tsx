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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllReceiptByIdOrder, getAllReceiptItemByIdOrder, getReceipt, getReceiptById } from "@/actions/receipts";
import { Receipt, ReceiptMedicine } from "@models/receipts";

export default function DetailItemRceived({ id }: { id: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [receipts, setReceipts] = useState<ReceiptMedicine[]>()

    useEffect(() => {
        getAllReceiptItemByIdOrder(id).then(res => setReceipts(res as ReceiptMedicine[]))
    }, [])
    console.log(receipts);
    


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
                            {receipts?.map((receipt) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{receipt.order_medicine.medicine.name}</TableCell>
                                    <TableCell>{receipt.order_medicine.medicine.medicine_code}</TableCell>
                                    <TableCell>{receipt.received}</TableCell>
                                    <TableCell>{receipt.order_medicine.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </div>
    );
}
