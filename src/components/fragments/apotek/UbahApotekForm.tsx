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
import { RoleSelect } from '../user/RoleSelect';
import { updateApotek } from '@/actions/apotek';

function UbahApotekForm() {

    const navigate = useRouter()

    const apotekScheme = z.object({
        name: z.string().min(2).max(255),
        email: z.string().min(3).max(55),
        alamat: z.string().min(2),
        phone: z.string().min(8).max(30),
    })

    const form = useForm<z.infer<typeof apotekScheme>>({
        resolver: zodResolver(apotekScheme),
        defaultValues: {
            alamat: "",
            email: "",
            name: "",
            phone: ""
        },
    })


    const handleLogin = async (values: z.infer<typeof apotekScheme>) => {
        const res = await updateApotek(values.name, values.alamat, values.email, values.phone)
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
                        name='alamat'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Alamat
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="text"
                                        placeholder="Alamat.."
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
                <Button type='submit' className="w-full bg-[#2A2B27] hover:bg-[#3F403B]">
                    Tambah
                </Button>
            </form>
        </Form>
    )
}

export default UbahApotekForm
