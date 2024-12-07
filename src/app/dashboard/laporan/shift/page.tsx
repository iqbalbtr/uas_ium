"use client";
import { getUser } from "@/actions/auth";
import ShiftTable from "@components/fragments/laporan/ShiftTable";
import CreateUserForm from "@components/fragments/user/CreateUserForm";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import usePagination from "@hooks/use-paggination";
import React, { useState } from "react";

function Shift() {
  const [shift, setShift] = useState<any[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getUser(page.page, page.limit);
      if (get) {
        setShift(get.data);
        setPage(get.pagging);
      }
    },
    initialize: true,
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Penjualan"></DashboardLayoutHeader>
    {/* Table */}
      <ShiftTable data={shift} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  );
}

export default Shift;
