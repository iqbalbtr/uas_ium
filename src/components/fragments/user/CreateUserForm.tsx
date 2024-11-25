"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { createUser } from '@/actions/auth';
import { RoleSelect } from './RoleSelect';

function CreateUserForm() {

    const navigate = useRouter()

    const loginScheme = z.object({
        username: z.string().min(3).max(55),
        name: z.string().min(2).max(255),
        email: z.string().min(2).max(255),
        phone: z.string().min(8).max(30),
        password: z.string().min(3).max(255),
        role: z.number().min(0),
    })

    const form = useForm<z.infer<typeof loginScheme>>({
        resolver: zodResolver(loginScheme),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            name: "",
            phone: "",
            role: 0,
        },
    })


    const handleLogin = async (values: z.infer<typeof loginScheme>) => {
        const res = await createUser({
            ...values,
            role: 0
        })
    }


    return (
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
                                        placeholder="password.."
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
                <Button type='submit' className="w-full bg-[#2A2B27] hover:bg-[#3F403B]">
                    Tambah
                </Button>
            </form>
        </Form>
    )
}

export default CreateUserForm
