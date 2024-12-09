"use client"
import { getLatestActivity } from '@/actions/activity-log'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Loading from '@components/ui/loading'
import useFetch from '@hooks/use-fetch'
import { formatCurrentTime } from '@libs/utils'
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
                <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {
                        data.map(fo => (
                            <div key={fo.id} className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{fo.description}</p>
                                    <p className="text-xs text-muted-foreground">{formatCurrentTime(fo.date!)}</p>
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
