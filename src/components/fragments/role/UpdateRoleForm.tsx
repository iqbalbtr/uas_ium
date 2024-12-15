"use client"

import { updateRole } from "@/actions/role";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoading from "@hooks/use-loading";
import { useForm } from "react-hook-form";
import { z } from "zod"
import AccessDialog from "./AccessDialog";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Edit, Pen } from "lucide-react";
import { toast } from "@hooks/use-toast";
import { TableMutation } from "@/model/view";
import { Role } from "@/model/roles";
import { NavType } from "@components/app/app-sidebar";
import { useState } from "react";
import Loading from "@components/ui/loading";

function UpdateRoleForm({
    data,
    handleFetch
}: TableMutation<Role>) {

    const { isLoading, setLoading } = useLoading();

    const roleScheme = z.object({
        name: z.string().min(2).max(55),
        acces_rights: z.array(z.any())
    })
    const [access, setAccess] = useState<NavType[]>(data.access_rights ?? [])

    const form = useForm<z.infer<typeof roleScheme>>({
        resolver: zodResolver(roleScheme),
        defaultValues: {
            acces_rights: data.access_rights,
            name: data.name
        }
    })


    const handleLogin = async (values: z.infer<typeof roleScheme>) => {
        setLoading("loading")
        try {
            const res = await updateRole(data.id, values.name, access)
            if (res) {
                setLoading("success")
                toast({
                    title: "Success",
                    description: res,
                })
                handleFetch && handleFetch()
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
        <Dialog>
            <DialogTrigger asChild>
                <button className={`bg-yellow-400/70 p-1 rounded-md border border-yellow-600`}>
                    <Pen size={15} className={`text-yellow-700`} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ubah Role
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 pt-6">
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
                                render={() => (
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
                                Ubah
                            </Loading>
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateRoleForm
