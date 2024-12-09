"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import React from "react";
import { TableView } from "@/model/view";
import { Transaction } from "@models/transactions";
import Loading from "@components/ui/loading";
import PrintInvoice from "./PrintInvoice";

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
        {
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
                <PrintInvoice current={fo.code_transaction} />
              </TableCell>
            </TableRow>
          ))
        }
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
  );
}

export default SellingTable;
