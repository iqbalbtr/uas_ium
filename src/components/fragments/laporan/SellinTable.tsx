"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import React, { useEffect, useState } from "react";
import { TableView } from "@/model/view";
import { Transaction } from "@models/transactions";
import ModalTable from "./modal-table";
import { Button } from "@components/ui/button";

function SellingTable({
  data,
  isLoading,
  handleFetch,
}: TableView<Transaction>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Pembeli</TableHead>
          <TableHead>Karyawan</TableHead>
          <TableHead>Metode</TableHead>
          <TableHead>Kadaluarsa</TableHead>
          <TableHead>Status Pembayaran</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pajak</TableHead>
          <TableHead>Diskon</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading !== "loading" ? (
          data.map((fo, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{fo.code_transaction}</TableCell>
              <TableCell>{fo.buyer}</TableCell>
              <TableCell>{fo.user?.name}</TableCell>
              <TableCell>{fo.payment_method}</TableCell>
              <TableCell>{fo.payment_expired?.toLocaleDateString()}</TableCell>
              <TableCell>{fo.payment_method}</TableCell>
              <TableCell>{fo.transaction_status}</TableCell>
              <TableCell>{fo.tax}</TableCell>
              <TableCell>{fo.discount}</TableCell>
              <TableCell>
                {fo.total}
              </TableCell>
              <TableCell>
                <Button>
                  Cetak
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>Loading</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default SellingTable;
