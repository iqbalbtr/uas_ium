"use client"
import { getTransaction } from '@/actions/transaction'
import PrintToExcel from '@components/fragments/laporan/PrintToExcel'
import SellingTable from '@components/fragments/laporan/SellingTable'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Button } from '@components/ui/button'
import usePagination from '@hooks/use-paggination'
import { handleDownload } from '@libs/utils'
import { getOrderExcel } from '@services/reports/order'
import { getSellingExcel } from '@services/reports/selling'
import React, { useState } from 'react'

function Penjualan() {

  const [penjualan, setPenjualan] = useState<any[]>([])

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getTransaction(page.page, page.limit)
      if (get) {
        setPenjualan(get.data)
        console.log(get);

        setPage(get.pagging)
      }
    },
    initialize: true
  })

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title='Penjualan'>
      <PrintToExcel data={getSellingExcel} fileName='data_penjualan.xlsx' />
      </DashboardLayoutHeader>
      <SellingTable data={penjualan} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  )
}

export default Penjualan
