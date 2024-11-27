"use client";

import React, { useEffect, useState } from "react";
import CreateRoleForm from "@components/fragments/role/CreateRoleForm";
import TableRole from "@components/fragments/role/TableRole";
import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { UserCog } from "lucide-react";
import usePagination from "@hooks/use-paggination";
import { getRole } from "@/actions/role";
import { toast } from "@hooks/use-toast";
import DashboardLayout, { DashboardLayoutHeader } from "@components/layouts/DashboardLayout";

function RoleMaster() {


  const [roles, setRoles] = useState<any[]>([]);


  const { Paggination, handleFetch, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getRole(page.page, page.limit)
      if (get) {
        setRoles(get.data)
        setPage(get.pagging)
      }
    },
    initialize: true
  })

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Master Role">
        <CreateRoleForm handleFetch={handleFetch} />
      </DashboardLayoutHeader>
      <TableRole isLoading={isLoading} handleFetch={handleFetch} data={roles} />
      <Paggination />
    </DashboardLayout>
  );
}

export default RoleMaster;
