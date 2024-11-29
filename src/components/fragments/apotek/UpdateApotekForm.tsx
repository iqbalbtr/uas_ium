"use client"
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { getApotek, updateApotek } from '@/actions/apotek';
import useLoading from '@hooks/use-loading';
import { toast } from '@hooks/use-toast';

function UpdateApotekForm() {

    const { isLoading, setLoading } = useLoading()

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


    const handleUpdate = async (values: z.infer<typeof apotekScheme>) => {
        setLoading("loading")
        try {
            const res = await updateApotek(values.name, values.alamat, values.email, values.phone)
            if (res) {
                toast({
                    title: "Success",
                    description: res
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Internal server error",
                variant: "destructive"
            })
        } finally {
            setLoading("idle")
        }
    }

    useEffect(() => {
        getApotek().then(res => {
            form.setValue("name", res?.name ?? "")
            form.setValue("alamat", res?.alamat ?? "")
            form.setValue("phone", res?.phone ?? "")
            form.setValue("email", res?.email ?? "")
        })
    }, [])

    return (
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
                <Button disabled={isLoading == "loading"} type='submit' className="w-full bg-[#2A2B27] hover:bg-[#3F403B]">
                    {isLoading == "loading" ? "Loading" : "Ubah"}
                </Button>
            </form>
        </Form>
    )
}

export default UpdateApotekForm
