import { getDifferenceIncome } from '@/actions/shift'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@components/ui/chart'
import Loading from '@components/ui/loading'
import useFetch from '@hooks/use-fetch'
import { TrendingUp } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
const chartConfig = {
    selling: {
        label: "Total Penjualan",
        color: "hsl(48 100% 50%)",
    },
    retur: {
        label: "Total Pengembalian",
        color: "hsl(200 100% 50%)",
    },
} satisfies ChartConfig;



function ShiftStatistic() {

    const statistic = useFetch({
        url: getDifferenceIncome,
        defaultValue: undefined
    })

    return (
        <Card className="col-span-2 row-span-4 bg-slate-100 col-start-4 row-start-3">
            <CardHeader>
                <CardTitle>Penjualan - Pengembalian</CardTitle>
                <CardDescription>
                    Daftar perbandingan penjualan dan pengembalian
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    statistic.isLoading == "loading" ? (
                        <Loading type='loader' isLoading='loading' />
                    ) : (
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={statistic.data}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <defs>
                                    <linearGradient id="fillSelling" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-selling)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-selling)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient id="fillRetur" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-retur)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-retur)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="sellingTotal"
                                    type="natural"
                                    fill="url(#fillRetur)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-retur)"
                                    stackId="a"
                                />
                                <Area
                                    dataKey="returTotal"
                                    type="natural"
                                    fill="url(#fillSelling)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-selling)"
                                    stackId="a"
                                />
                            </AreaChart>
                        </ChartContainer>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default ShiftStatistic
