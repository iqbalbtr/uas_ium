"use client";

import { useState } from "react";
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

export default function ModalTable() {
  const [isOpen, setIsOpen] = useState(false);

  const tableData = [
    {
      id: "1",
      name: "John Doe",
      quantity: "10",
      subtotal: "1000",
      kode_obat: "A123",
    },
  ];

  return (
    <div className="flex items-center justify-center ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Table</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Kode Obat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.quantity}</TableCell>
                  <TableCell>{user.subtotal}</TableCell>
                  <TableCell>{user.kode_obat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
