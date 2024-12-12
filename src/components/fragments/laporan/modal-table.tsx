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
import { getAllReceiptByIdOrder, getReceipt } from "@/actions/receipts";
import { Receipt } from "@models/receipts";
import DetailItemRceived from "./DetailItemReceived";

export default function ModalTable({id}:{id: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([])

  useEffect(() => {
    getAllReceiptByIdOrder(id).then(res => setReceipts(res as Receipt[]))
  },[])


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
                <TableHead>Kode penerimaan</TableHead>
                <TableHead>Kurir</TableHead>
                <TableHead>Total item diterima</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lihat item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.receipt_code}>
                  <TableCell>{receipt.receipt_code}</TableCell>
                  <TableCell>{receipt.delivery_name}</TableCell>
                  <TableCell>{receipt.total_received_item}</TableCell>
                  <TableCell>{receipt.receipt_status}</TableCell>
                  <TableCell><DetailItemRceived id={id} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
