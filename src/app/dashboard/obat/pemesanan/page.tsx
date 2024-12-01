"use client"
import { getOrder } from '@/actions/order';
import CreateOrderForm from '@components/fragments/order/CreateOrderForm'
import InstallmentOrder from '@components/fragments/order/InstallmentOrder';
import OrderTable from '@components/fragments/order/OrderTable';
import OrderTableMain from '@components/fragments/order/OrderTableView';
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout';
import usePagination from '@hooks/use-paggination';
import { Order } from '@models/orders';
import React, { useState } from 'react'

function Pemesanan() {
  const [users, setUser] = useState<Order[]>([]);

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getOrder(page.page, page.limit);
      if (get) {
        setUser(get.data as Order[]);
        console.log(get);
        
        setPage(get.pagging);
      }
    },
    initialize: true,
  });

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Pemesanan">
        <InstallmentOrder />
        <CreateOrderForm handleFetch={handleFetch} />
      </DashboardLayoutHeader>
      <OrderTableMain
        data={users}
        isLoading={isLoading}
        handleFetch={handleFetch}
      />
      <Paggination />
    </DashboardLayout>
  );
}

export default Pemesanan
