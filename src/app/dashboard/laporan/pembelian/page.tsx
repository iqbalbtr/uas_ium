"use client"
import { getOrder } from '@/actions/order'
import PrintToExcel from '@components/fragments/laporan/PrintToExcel'
import ReceiptTable from '@components/fragments/laporan/ReceiptTable'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Button } from '@components/ui/button'
import usePagination from '@hooks/use-paggination'
import { getOrderExcel } from '@services/reports/order'
import React, { useState } from 'react'

function Pembelian() {

  const [pembelian, setPembelian] = useState<any[]>([])

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getOrder(page.page, page.limit)
      if (get) {
        setPembelian(get.data)
        setPage(get.pagging)
      }
    },
    initialize: true
  })

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title='Pembelian'>
        <PrintToExcel data={getOrderExcel} fileName='data_pembelian.xlsx' />
      </DashboardLayoutHeader>
      <ReceiptTable data={pembelian} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  )
}

export default Pembelian
