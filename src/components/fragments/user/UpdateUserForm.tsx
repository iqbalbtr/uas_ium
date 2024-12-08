"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { updateUser } from '@/actions/auth';
import { RoleSelect } from '../role/RoleSelect';
import useLoading from '@hooks/use-loading';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Edit } from 'lucide-react';
import { toast } from '@hooks/use-toast';
import { TableMutation } from '@/model/view';
import { User } from '@/model/users';
import Loading from '@components/ui/loading';

function UpdateUserForm({ data, handleFetch }: TableMutation<User>) {

    const { isLoading, setLoading } = useLoading()
    const [isOpen, setOpen] = useState(false)

    const userSchema = z.object({
        id: z.number(),
        username: z.string().min(3).max(55),
        name: z.string().min(2).max(255),
        email: z.string().email().min(2).max(255),
        phone: z.string().min(8).max(30),
        password: z.string().max(255).optional(),
        role: z.string().min(1),
    })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: data.id,
            username: data.username,
            email: data.email ?? "",
            name: data.name,
            phone: data.phone ?? "",
            role: data.role?.name,
            password: ""
        },
    })


    const handleUpdate = async (values: z.infer<typeof userSchema>) => {
        try {
            setLoading("loading")
            const res = await updateUser(values.id, values.name, values.email, values.phone, values.role, values.password);
            if (res) {
                toast({
                    title: "Success",
                    description: res,
                })
                handleFetch && await handleFetch()
                setOpen(false)
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


    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ubah user
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4 pt-6">
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
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="username"
                                                placeholder="username.."
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
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                placeholder="email.."
                                                type="email"
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
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Phone
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="phone"
                                                placeholder="phone.."
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
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                placeholder="Optional change..."
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
                                name='role'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel>
                                            Role
                                        </FormLabel>
                                        <FormControl>
                                            <RoleSelect onChange={field.onChange} value={field.value} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button disabled={isLoading == "loading"} type='submit' className="w-full">
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

export default UpdateUserForm
