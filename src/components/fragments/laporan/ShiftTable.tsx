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

function ShiftTable({ data, isLoading, handleFetch }: TableView<Transaction>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Waktu Mulai</TableHead>
          <TableHead>Waktu Berakhir</TableHead>
          <TableHead>Saldo Awal</TableHead>
          <TableHead>Total Pengembalian</TableHead>
          <TableHead>Total Pengeluaran</TableHead>
          <TableHead>Catatan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pemegang</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Drg bener :) */}
        {/* {isLoading !== "loading" ? (
          data.map((fo, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{fo.code_transaction}</TableCell>
              <TableCell>{fo.buyer}</TableCell>
              <TableCell>{fo.user?.name}</TableCell>
              <TableCell>{fo.payment_method}</TableCell>
              <TableCell>{fo.payment_expired?.toLocaleDateString()}</TableCell>
              <TableCell>{fo.status}</TableCell>
              <TableCell>
                <ModalTable />
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>Loading</TableCell>
          </TableRow>
        )} */}
      </TableBody>
    </Table>
  );
}

export default ShiftTable;
