"use client"
import { getAnalisytTypeTransaction } from '@/actions/dashboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import useFetch from '@hooks/use-fetch';
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const COLORS = ["#8884d8", "#ffc658", "#ff8042"];

const pieChartData = [
    { name: "Sale", value: 400 },
    { name: "Distribute", value: 300 },
    { name: "Return", value: 300 },
];

function CategoryChart() {

    const { data } = useFetch<{ name: string, value: number }[]>({
        url: getAnalisytTypeTransaction,
        defaultValue: []
    })

    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 absolute bottom-4 right-4 space-y-2">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <div className="flex-1 text-sm">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">{entry.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryChart
