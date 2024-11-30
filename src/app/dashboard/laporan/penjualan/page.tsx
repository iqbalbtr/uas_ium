"use client"
import { getUser } from '@/actions/auth'
import TablePenjualan from '@components/fragments/laporan/SellinTable'
import CreateUserForm from '@components/fragments/user/CreateUserForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import usePagination from '@hooks/use-paggination'
import React, { useState } from 'react'

function Penjualan() {

  const [penjualan, setPenjualan] = useState<any[]>([])

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getUser(page.page, page.limit)
      if (get) {
        setPenjualan(get.data)
        setPage(get.pagging)
      }
    },
    initialize: true
  })

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title='Penjualan'>
      </DashboardLayoutHeader>
      <TablePenjualan data={penjualan} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  )
}

export default Penjualan
