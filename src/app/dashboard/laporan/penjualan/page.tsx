"use client"
import { getUser } from '@/actions/auth'
import { getTransaction } from '@/actions/transaction'
import TablePenjualan from '@components/fragments/laporan/SellinTable'
import CreateUserForm from '@components/fragments/user/CreateUserForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Button } from '@components/ui/button'
import usePagination from '@hooks/use-paggination'
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
      <Button>Export excel</Button>
      </DashboardLayoutHeader>
      <TablePenjualan data={penjualan} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  )
}

export default Penjualan
