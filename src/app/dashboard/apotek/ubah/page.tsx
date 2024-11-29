import UpdateApotekForm from '@components/fragments/apotek/UpdateApotekForm'
import React from 'react'

function ApotelUbah() {
  return (
    <div className='w-full p-4'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl py-3 font-semibold'>Ubah Apotek</h1>
      </div>
        <UpdateApotekForm />
    </div>
  )
}

export default ApotelUbah
