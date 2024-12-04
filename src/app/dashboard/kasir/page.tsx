"use client"
import OrderTable from '@components/fragments/order/OrderTable'
import SearchMedicine from '@components/fragments/medicine/SearchMedicine'
import TrasnsactionForm from '@components/fragments/kasir/CreateTransactionForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Input } from '@components/ui/input'
import { toast } from '@hooks/use-toast'
import { Medicine } from '@models/medicines'
import React, { Suspense, useState } from 'react'
import { Button } from '@components/ui/button'
import { getTransactionByCode } from '@/actions/transaction'
import { printPdf } from '@components/pdf/util'
import Invoice from '@components/pdf/Invoice'
import useLoading from '@hooks/use-loading'
import { getApotek } from '@/actions/apotek'
import { apotek } from '@db/schema'
import { Apotek } from '@models/apotek'

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
  const [current, setCurrent] = useState("")
  const { isLoading, setLoading } = useLoading()

  async function handlePrint() {
    setLoading("loading")
    try {
      const toko = await getApotek();
      const trans = await getTransactionByCode(current);
      if (trans && toko) {
        await printPdf(await Invoice({ transaksi: trans as any, toko: toko as Apotek }), "Invoice")
        
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading("idle")
    }
  }

  function handleAdd(val: Medicine, qty: number) {

    if (!qty)
      return

    if (val.stock == 0)
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
    <Suspense>
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
                <TrasnsactionForm items={items} setCurrent={setCurrent} setTotal={setTotal} setItem={setItems} />
                {current && <Button disabled={isLoading == "loading"} variant={'destructive'} className='w-full mt-2' onClick={handlePrint}>Cetak</Button>}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Suspense>

  )
}

export default Kasir
