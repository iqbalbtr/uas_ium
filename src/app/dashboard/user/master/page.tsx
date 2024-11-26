"use client"
import { getUser } from '@/actions/auth'
import CreateUserForm from '@components/fragments/user/CreateUserForm'
import TableUser from '@components/fragments/user/TableUser'
import usePagination from '@hooks/use-paggination'
import React, { useState } from 'react'

function MasterUser() {

  const [users, setUser] = useState<any[]>([])

  const {handleFetch, Paggination, isLoading} = usePagination({
    handleGet: async (page, setPage) => {
      const get = await getUser(page.page, page.limit)
        if(get){
          setUser(get.data)
          setPage(get.pagging)
        }
    },
    initialize: true
  })

  return (
    <div className='w-full p-4'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl py-3 font-semibold'>Master User</h1>
        <CreateUserForm />
      </div>
      <TableUser data={users} isLoading={isLoading} handleFetch={handleFetch} />
      <Paggination />
    </div>
  )
}

export default MasterUser
