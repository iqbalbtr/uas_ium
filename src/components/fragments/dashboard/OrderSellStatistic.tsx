"use client"
import { getAnalisytStatisticTransaction } from '@/actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Loading from '@components/ui/loading'
import { Tooltip } from 'recharts' 
import useFetch from '@hooks/use-fetch'
import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

function OrderSellStatistic() {

    const { data, isLoading } = useFetch({
        defaultValue: [],
        url: getAnalisytStatisticTransaction
    })


    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    {
                        isLoading == "loading" ?
                        <Loading isLoading='loading' type='loader' /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip/>
                                        <Line
                                            name="Total penjualan"
                                            type="monotone"
                                            dataKey="sellingTotal"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line type="monotone" name="Total Pembelian" dataKey="orderTotal" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default OrderSellStatistic
