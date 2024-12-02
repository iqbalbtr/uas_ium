"use client"

import * as React from "react"
import { Minus, Pen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { TableMutation } from "@models/view"
import { Prescription } from "@models/prescription"
import { presciptionMutation } from "@/actions/prescription"
import { toast } from "@hooks/use-toast"
import useLoading from "@hooks/use-loading"


export function PrescriptionStock({ data, handleFetch }: TableMutation<Prescription>) {
  const [qty, setQty] = React.useState(data.stock)
  const [isOpen, setOpen] = React.useState(false)
  const {isLoading, setLoading} = useLoading()

  function onClick(adjustment: number) {
    setQty(pv => pv +adjustment)
  }

  async function handleUpdate() {
    setLoading("loading")
    try {
      const res = await presciptionMutation(data.id, qty)
      if(res){
        toast({
          title: "Success",
          description: res
        })
        handleFetch && handleFetch()
        setOpen(false)
      }
    } catch (error: any) {
      toast({
        title: "Success",
        description: error.message,
        variant: "destructive"
      })
    } finally{
      setLoading("idle")
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="flex gap-2 items-center">
          {data.stock}
          <Pen size={12} />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Ubah stock</DrawerTitle>
            <DrawerDescription>Ubah stock racikan.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                disabled={qty == 0}
                onClick={() => onClick(-1)}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {qty}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Stock
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(1)}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleUpdate} disabled={isLoading == "loading"}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
