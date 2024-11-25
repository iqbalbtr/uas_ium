import CreateUserForm from '@components/fragments/user/CreateUserForm'
import TableUser from '@components/fragments/user/TableUser'
import { Button } from '@components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet'
import React from 'react'

function MasterUser() {

  return (
    <div className='w-full p-4'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl py-3 font-semibold'>Master User</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">Tambah</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tambah User</SheetTitle>
            </SheetHeader>
            <CreateUserForm />
          </SheetContent>
        </Sheet>
      </div>
      <TableUser />
    </div>
  )
}

export default MasterUser
