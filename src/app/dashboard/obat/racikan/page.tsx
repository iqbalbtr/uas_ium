"use client";
import { getMedicine } from "@/actions/medicine";
import { getPresciption } from "@/actions/prescription";
import CreateMedicineForm from "@components/fragments/medicine/CreateMedicineForm";
import MedicineTable from "@components/fragments/medicine/MedicineTable";
import CreatePresceptionForm from "@components/fragments/presception/CreatePresceptionForm";
import PresciptionTable from "@components/fragments/presception/PresciptionTable";
import CreateUserForm from "@components/fragments/user/CreateUserForm";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import usePagination from "@hooks/use-paggination";
import { Prescription } from "@models/prescription";
import React, { useState } from "react";

function Racikan() {
  const [users, setUser] = useState<Prescription[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getPresciption(page.page, page.limit);
      if (get) {
        setUser(get.data as Prescription[]);
        setPage(get.pagging);
      }
    },
    initialize: true,
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Master Racikan">
        <CreatePresceptionForm handleFetch={handleFetch} />
      </DashboardLayoutHeader>
      <PresciptionTable
        data={users}
        isLoading={isLoading}
        handleFetch={handleFetch}
      />
      <Paggination />
    </DashboardLayout>
  );
}

export default Racikan;
