"use client"
import { getUser } from '@/actions/auth'
import CreateUserForm from '@components/fragments/user/CreateUserForm'
import TableUser from '@components/fragments/user/TableUser'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import usePagination from '@hooks/use-paggination'
import React, { useState } from 'react'

function MasterUser() {

  const [users, setUser] = useState<any[]>([])

  const { handleFetch, Paggination, isLoading } = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getUser(page.page, page.limit)
      if (get) {
        setUser(get.data)
        setPage(get.pagging)
      }
    },
    initialize: true
  })

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title='Master User'>
        <CreateUserForm />
      </DashboardLayoutHeader>
      <TableUser data={users} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </DashboardLayout>
  )
}

export default MasterUser
