"use client";
import { getUser } from "@/actions/auth";
import { getShift } from "@/actions/shift";
import PrintToExcel from "@components/fragments/laporan/PrintToExcel";
import ShiftTable from "@components/fragments/laporan/ShiftTable";
import CreateUserForm from "@components/fragments/user/CreateUserForm";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import usePagination from "@hooks/use-paggination";
import { Shift as ShiftType } from "@models/shift";
import { getShiftExcel } from "@services/reports/shift";
import React, { useState } from "react";

function Shift() {
  const [shift, setShift] = useState<ShiftType[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getShift(page.page, page.limit);
      if (get) {
        setShift(get.data as ShiftType[]);
        setPage(get.pagging);
      }
    },
    initialize: true,
    setData: setShift
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Daftar Shift">
        <PrintToExcel data={getShiftExcel} fileName='data_shift.xlsx' />
      </DashboardLayoutHeader>
      <ShiftTable data={shift} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  );
}

export default Shift;
