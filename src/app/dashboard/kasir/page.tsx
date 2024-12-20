"use client"
import OrderTable from '@components/fragments/order/OrderTable'
import SearchMedicine from '@components/fragments/medicine/SearchMedicine'
import TrasnsactionForm from '@components/fragments/transaction/CreateTransactionForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Input } from '@components/ui/input'
import { toast } from '@hooks/use-toast'
import React, { Suspense, useEffect, useState } from 'react'
import { Button } from '@components/ui/button'
import useLoading from '@hooks/use-loading'
import UpdateInstallmentPayment from '@components/fragments/transaction/UpdateInstallmentPayment'
import ReturTransactionForm from '@components/fragments/transaction/ReturTransactionForm'
import { getLatestShift } from '@/actions/shift'
import Link from 'next/link'
import useFetch from '@hooks/use-fetch'
import Loading from '@components/ui/loading'
import { getInvoicePdf } from '@services/pdf/invoice'
import { getRupiahFormat } from '@libs/utils'

export type Item = {
  id: number;
  qty: number;
  name: string;
  code: string;
  purchase_price: number;
  stock: number;
  type: "medicine" | "presciption";
  selling_price: number;
}


function Kasir() {

  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState("")
  const { isLoading, setLoading } = useLoading()

  const shift = useFetch({
    url: getLatestShift,
    defaultValue: undefined
  })

  async function handlePrint() {
    setLoading("loading")
    try {
      await getInvoicePdf(current)
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

  function handleAdd(val: Item, qty: number) {

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


    const isExist = items.find(fo => fo.id == val.id)

    if (isExist?.qty! + qty > val.stock)
      return toast({
        title: "Error",
        description: "Batas jumlah melebihi stock",
        variant: "destructive"
      })

    setItems(prevItems => {
      if (isExist) {
        return prevItems.map((item) =>
          item.id === isExist.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [
          {
            ...val,
            qty: qty
          },
          ...prevItems,
        ];
      }
    });
  }


  return (
    <Suspense>
      <DashboardLayout>
        {(shift.data === undefined || (shift.data && shift.data.status_shift !== "pending")) && (
          <div className="absolute top-0 left-0 bg-black/50 z-[9999] w-full h-screen flex justify-center items-center">
            {
              shift.isLoading !== "idle" ? (
                <Loading isLoading='loading' type='loader' />
              ) : (
                <Button>
                  <Link href={"/dashboard/apotek/shift"}>Buka shift</Link>
                </Button>
              )
            }
          </div>
        )}

        <DashboardLayoutHeader title='Kasir'>
          {/* <ReturTransactionForm handleFetch={async () => { }} /> */}
          <UpdateInstallmentPayment />
        </DashboardLayoutHeader>
        <div className='relative'>
          <div className='grid md:grid-cols-2 gap-2'>
            <div>
              {/* <Input disabled value={shift.data?.cashier_balance ?? 0} /> */}
              <SearchMedicine variant='selling' handleAdd={handleAdd} />
            </div>
            <div className='flex flex-col gap-2'>
              <div>
                <h1 className='text-xl font-semibold px-3 py-2'>{getRupiahFormat(total)}</h1>
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
    </Suspense >

  )
}

export default Kasir
