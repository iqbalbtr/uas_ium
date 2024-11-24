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

function LoginForm() {

    const navigate = useRouter()

    const loginScheme = z.object({
        username: z.string().min(3).max(55),
        password: z.string().min(3).max(255)
    })

    const form = useForm<z.infer<typeof loginScheme>>({
        resolver: zodResolver(loginScheme),
        defaultValues: {
            username: "",
            password: ""
        },
    })


    const handleLogin = async (values: z.infer<typeof loginScheme>) => {
            const res = await signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false
            })

            if(!res?.ok){
                alert("Username or password is wrong")
            } else {
                navigate.push("/dashboard")
            }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="password"
                                        placeholder="password.."
                                        type="password"
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
                    Continue
                </Button>
            </form>
        </Form>
    )
}

export default LoginForm
