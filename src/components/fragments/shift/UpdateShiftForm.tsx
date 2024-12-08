"use client"
import { updateBalanceShift } from '@/actions/shift'
import { Button } from '@components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@components/ui/drawer'
import { Input } from '@components/ui/input'
import Loading from '@components/ui/loading'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import React, { useState } from 'react'

function UpdateShiftForm() {

    const [isOpen, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()
    const [saldo, setSaldo] = useState(0)

    async function handleUpdate() {
        setLoading("loading")
        try {
            if (!saldo || saldo < 0)
                throw new Error("Saldo is not valid")

            const res = await updateBalanceShift(saldo)
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
                setOpen(false)
                setSaldo(0)
            }
        } catch (error: any) {
            toast({
                title: "Success",
                description: error.message,
                variant: "destructive"
            })

        } finally {
            setLoading("idle")
        }
    }

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    Tambah saldo
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Tambah saldo</DrawerTitle>
                        <DrawerDescription>Estimasi saldo 20000</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">

                            <div className="flex-1 text-center">
                                <Input placeholder='Tambah saldo' value={saldo} onChange={(e) => setSaldo(!isNaN(Number(e.target.value)) ? Number(e.target.value) : saldo)} />
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleUpdate} disabled={isLoading == "loading"}>
                            <Loading isLoading={isLoading}>
                                Tambah
                            </Loading>
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default UpdateShiftForm
