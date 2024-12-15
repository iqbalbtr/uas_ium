"use client"
import { getLatestActivity } from '@/actions/activity-log'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Loading from '@components/ui/loading'
import useFetch from '@hooks/use-fetch'
import { getActionClass } from '@libs/style'
import { cn, formatCurrentTime } from '@libs/utils'
import { Activity } from 'lucide-react'
import React from 'react'

function RecentActivity() {


    const { data, isLoading } = useFetch({
        url: getLatestActivity,
        defaultValue: []
    })


    return (
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle>Riwayat Aktifitas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {
                        data.map(fo => (
                            <div key={fo.id} className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                                    <Activity className={cn(getActionClass(fo.action_type as any),"p-4 rounded-full")} />
                                </div>
                                <div className='flex justify-between w-full items-start'>
                                    <div>
                                        <h1 className='text-xs font-bold'>{fo.action_name}</h1>
                                        <p className="text-sm line-clamp-1">{fo.description}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrentTime(fo.date!)}</p>
                                    </div>
                                    <Badge className={getActionClass(fo.action_type as any)}>{fo.action_type}</Badge>
                                </div>
                            </div>
                        ))
                    }
                    {
                        isLoading == "loading" ? (
                            <span className='w-full '>
                                <Loading type='loader' isLoading='loading' />
                            </span>
                        ) : data.length == 0 && (
                            <span className='w-full '>
                                Data kosong
                            </span>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentActivity
