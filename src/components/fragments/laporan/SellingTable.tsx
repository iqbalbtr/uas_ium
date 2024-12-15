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
import { cn, getRupiahFormat } from "@libs/utils";
import { getPaymentClass, getStatusTransClass } from "@libs/style";

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
              <TableCell><span className={getPaymentClass(fo.payment_method).class}>{getPaymentClass(fo.payment_method).label}</span></TableCell>
              <TableCell>{fo.payment_expired?.toLocaleDateString()}</TableCell>
              <TableCell><span className={cn(getStatusTransClass(fo.transaction_status).class)}>{getStatusTransClass(fo.transaction_status).label}</span></TableCell>
              <TableCell>{fo.tax}%</TableCell>
              <TableCell>{fo.discount}%</TableCell>
              <TableCell>
                {getRupiahFormat(fo.total)}
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
