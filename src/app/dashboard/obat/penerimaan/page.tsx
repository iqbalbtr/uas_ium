"use client";
import { getMedicine } from "@/actions/medicine";
import { getReceipt } from "@/actions/receipts";
import CreateMedicineForm from "@components/fragments/medicine/CreateMedicineForm";
import MedicineTable from "@components/fragments/medicine/MedicineTable";
import CreateReceiptForm from "@components/fragments/receipt/CreateReceiptForm";
import ReceiptTable from "@components/fragments/receipt/ReceiptTable";
import CreateUserForm from "@components/fragments/user/CreateUserForm";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import usePagination from "@hooks/use-paggination";
import { Receipt } from "@models/receipts";
import React, { useState } from "react";

function Penerimaan() {
  const [users, setUser] = useState<Receipt[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getReceipt(page.page, page.limit);
      if (get) {
        setUser(get.data as any[]);
        setPage(get.pagging);
      }
    },
    initialize: true,
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Penerimaan barang">
        <CreateReceiptForm handlefetch={handleFetch} />
      </DashboardLayoutHeader>
      <ReceiptTable
        data={users}
        isLoading={isLoading}
        handleFetch={handleFetch}
      />
      <Paggination />
    </DashboardLayout>
  );
}

export default Penerimaan;
