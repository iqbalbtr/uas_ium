"use client";
import { getMedicine } from "@/actions/medicine";
import CreateMedicineForm from "@components/fragments/medicine/CreateMedicineForm";
import MedicineTable from "@components/fragments/medicine/MedicineTable";
import CreateUserForm from "@components/fragments/user/CreateUserForm";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import usePagination from "@hooks/use-paggination";
import React, { useState } from "react";

function ObatMaster() {
  const [users, setUser] = useState<any[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getMedicine(page.page, page.limit);
      if (get) {
        setUser(get.data);
        setPage(get.pagging);
      }
    },
    initialize: true,
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Master User">
        <CreateMedicineForm handleFetch={handleFetch} />
      </DashboardLayoutHeader>
      <MedicineTable
        data={users}
        isLoading={isLoading}
        handleFetch={handleFetch}
      />
      <Paggination />
    </DashboardLayout>
  );
}

export default ObatMaster;
