"use client"
import OrderTable from '@components/fragments/order/OrderTable'
import SearchMedicine from '@components/fragments/medicine/SearchMedicine'
import TrasnsactionForm from '@components/fragments/kasir/CreateTransactionForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Input } from '@components/ui/input'
import { toast } from '@hooks/use-toast'
import { Medicine } from '@models/medicines'
import React, { useState } from 'react'

export type Item = {
  medicineId: number;
  qty: number;
  name: string;
  price: number;
  stock: number
}


function Kasir() {

  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);

  function handleAdd(val: Medicine, qty: number) {

    if(!qty)
      return

    if(val.stock == 0)
      return

    if (qty > val.stock)
      return toast({
        title: "Error",
        description: "Batas jumlah melebihi stock",
        variant: "destructive"
      })


    const isExist = items.find(fo => fo.medicineId == val.id)

    if (isExist?.qty! + qty > val.stock)
      return toast({
        title: "Error",
        description: "Batas jumlah melebihi stock",
        variant: "destructive"
      })

    setItems(prevItems => {
      if (isExist) {
        return prevItems.map((item) =>
          item.medicineId === isExist.medicineId
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [
          {
            medicineId: val.id,
            name: val.name,
            price: val.price,
            qty: qty,
            stock: val.stock
          },
          ...prevItems,
        ];
      }
    });
  }

  return (
    <DashboardLayout>
      <DashboardLayoutHeader title='Kasir' />
      <div>
        <div className='grid md:grid-cols-2 gap-2'>
          <SearchMedicine handleAdd={handleAdd} />

          <div className='flex flex-col gap-2'>
            <div>
              <Input value={total} disabled className='text-xl text-left' />
            </div>
            <OrderTable variant='transaction' items={items} setItem={setItems} />
            <div className='p-3 rounded-md bg-card shadow border-foreground'>
              <TrasnsactionForm items={items} setTotal={setTotal} setItem={setItems} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Kasir
