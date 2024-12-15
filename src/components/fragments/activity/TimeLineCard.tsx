import { ActivityType } from '@components/fragments/activity/TimelineLog';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import React from 'react'

function TimeLineCard({ data }: { data: ActivityType }) {
    return (
        <Card>
                <CardHeader>
                    <CardTitle className='pr-0 text-2xl font-semibold'>
                        {data.date}
                    </CardTitle>
                </CardHeader>
            <CardContent>
                <CardDescription className=''>
                    {
                        data.data.map(fo => (
                            <div key={fo.id} className="relative pl-4 pb-12 pb-8 last:pb-0 border-l border-yellow-200">
                                <div className="absolute left-[-5px] w-2 h-2 rounded-full bg-white border-2 border-gray-200 border-yellow-400" />
                                <div className="flex items-start gap-3">
                                    <div className="min-w-[60px] flex flex-col text-gray-500">
                                        <span className="text-lg font-semibold">
                                            {String(fo.date.getHours()).padStart(2, "0")}:{String(fo.date.getMinutes()).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl text-slate-600 font-semibold mb-1">{fo.title} <Badge>{fo.action_type}</Badge> </span>
                                        <span className="text-sm text-gray-500">{fo.description}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </CardDescription>
            </CardContent>
        </Card>
    )
}

export default TimeLineCard
