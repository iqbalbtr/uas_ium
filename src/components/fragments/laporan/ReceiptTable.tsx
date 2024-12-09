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
import ModalTable from "./modal-table";
import { Order } from "@models/orders";
import DetailItemOrder from "./DetailItemOrder";
import { useNumberPage } from "@hooks/use-paggination";
import Loading from "@components/ui/loading";

function ReceiptTable({ data, isLoading, handleFetch }: TableView<Order>) {

  const { getNumber } = useNumberPage({})

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Tanggal Pesan</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Status Pesanan</TableHead>
          <TableHead>Pajak</TableHead>
          <TableHead>Diskon</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Penerimaan</TableHead>
          <TableHead>Obat dibeli</TableHead>
          <TableHead>Metode Pembayaran</TableHead>
          <TableHead>Pembayaran Kadaluarsa</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((fo, i) => (
            <TableRow key={i}>
              <TableCell>{getNumber(i)}</TableCell>
              <TableCell>{fo.order_code}</TableCell>
              <TableCell>{fo.order_date?.toLocaleString()}</TableCell>
              <TableCell>{fo.supplier}</TableCell>
              <TableCell>{fo.order_status}</TableCell>
              <TableCell>{fo.tax}</TableCell>
              <TableCell>{fo.discount}</TableCell>
              <TableCell>{fo.total}</TableCell>
              <TableCell>
                <ModalTable id={fo.id} />
              </TableCell>
              <TableCell>
                <DetailItemOrder id={fo.id} />
              </TableCell>
              <TableCell>{fo.payment_method}</TableCell>
              <TableCell>{fo.payment_expired?.toLocaleString()}</TableCell>
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

export default ReceiptTable;
