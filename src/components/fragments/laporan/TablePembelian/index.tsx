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
import ModalTable from "../modal-table";
import UpdateUserForm from "@components/fragments/user/UpdateRoleForm";
import { Order } from "@models/orders";

function TablePembelian({ data, isLoading, handleFetch }: TableView<Order>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Tanggal Pesan</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Status Pesanan</TableHead>
          <TableHead>Pajak</TableHead>
          <TableHead>Diskon</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status Penerimaan</TableHead>
          <TableHead>Metode Pembayaran</TableHead>
          <TableHead>Pembayaran Kadaluarsa</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading !== "loading" ? (
          data.map((fo, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{fo.order_date?.toLocaleString()}</TableCell>
              <TableCell>{fo.supplier}</TableCell>
              <TableCell>{fo.order_status}</TableCell>
              <TableCell>{fo.tax}</TableCell>
              <TableCell>{fo.discount}</TableCell>
              <TableCell>{fo.total}</TableCell>
              {/* Drg bener */}
              <TableCell>
                {fo.order_medicines}
                <ModalTable />
              </TableCell>
              <TableCell>{fo.payment_method}</TableCell>
              <TableCell>{fo.payment_expired?.toLocaleString()}</TableCell>
              <TableCell>
                <UpdateUserForm handleFetch={handleFetch} data={fo} />
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

export default TablePembelian;
