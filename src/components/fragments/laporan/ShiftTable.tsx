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
import { Shift } from "@models/shift";
import { getDateFormat } from "@libs/utils";
import { Button } from "@components/ui/button";
import { Printer } from "lucide-react";
import Loading from "@components/ui/loading";
import { useNumberPage } from "@hooks/use-paggination";

function ShiftTable({ data, isLoading, handleFetch }: TableView<Shift>) {

  const { getNumber } = useNumberPage({})

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
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((fo, i) => (
            <TableRow key={i}>
              <TableCell>{getNumber(i)}</TableCell>
              <TableCell>{getDateFormat(fo.start_shift)}</TableCell>
              <TableCell>{getDateFormat(fo.end_shift)}</TableCell>
              <TableCell>{fo.begining_balance}</TableCell>
              <TableCell>{fo.retur_total}</TableCell>
              <TableCell>{fo.income_total}</TableCell>
              <TableCell>{fo.notes}</TableCell>
              <TableCell>
                {fo.status_shift}
              </TableCell>
              <TableCell>
                {fo.holder.name}
              </TableCell>
              <TableCell>
                <Button>
                  <Printer />
                </Button>
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

export default ShiftTable;
