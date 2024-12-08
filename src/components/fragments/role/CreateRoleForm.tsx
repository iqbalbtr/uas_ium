"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { createRole } from '@/actions/role';
import AccessDialog from './AccessDialog';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { UserCog } from 'lucide-react';
import { NavType } from '@components/app/app-sidebar';
import Loading from '@components/ui/loading';

function CreateRoleForm({
    handleFetch
}: {
    handleFetch?: () => Promise<void>
}) {

    const { isLoading, setLoading } = useLoading();
    const [isOpen, setOpen] = useState(false)
    const [access, setAccess] = useState<NavType[]>([
        {
            "title": "Dashboard",
            "icon": "LayoutDashboard",
            "url": "/dashboard",
            "isParent": true
        },
    ])

    const roleScheme = z.object({
        name: z.string().min(2).max(55),
        acces_rights: z.any()
    })

    const form = useForm<z.infer<typeof roleScheme>>({
        resolver: zodResolver(roleScheme),
        defaultValues: {
            acces_rights: [],
            name: ""
        }
    })


    const handleCreate = async (values: z.infer<typeof roleScheme>) => {
        setLoading("loading")
        try {
            const res = await createRole(values.name, access)
            if (res) {
                setLoading("success")
                toast({
                    title: "Success",
                    description: res
                })
                handleFetch && handleFetch()
                setOpen(false)
                setAccess([])
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
            setLoading("error")
        }
    }


    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    Tambah
                    <UserCog className="ml-2" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Tambah Role</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="name.."
                                                type="text"
                                                className="placeholder:opacity-50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='acces_rights'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-2'>
                                        <FormLabel>
                                            Hak Akses
                                        </FormLabel>
                                        <AccessDialog access={access} setAccess={setAccess}>
                                            <Button variant={"outline"}>
                                                Cek akses
                                            </Button>
                                        </AccessDialog>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type='submit' disabled={isLoading == "loading"} className="w-full bg-[#2A2B27] text-white hover:bg-[#3F403B]">
                            <Loading isLoading={isLoading}>
                                Tambah
                            </Loading>
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>

    )
}

export default CreateRoleForm
