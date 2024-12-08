"use client"
import { getLatestShift } from '@/actions/shift'
import CreateShiftForm from '@components/fragments/shift/CreateShiftForm'
import EndShiftUserForm from '@components/fragments/shift/EndShiftUserForm'
import PrintShift from '@components/fragments/shift/PrintShift'
import UpdateShiftForm from '@components/fragments/shift/UpdateShiftForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import useFetch from '@hooks/use-fetch'
import { getRupiahFormat } from '@libs/utils'
import React from 'react'

function Shift() {

    const { data, isLoading, refresh } = useFetch({
        url: getLatestShift,
        defaultValue: undefined,
        initialize: true
    })

    return (
        <DashboardLayout>
            <DashboardLayoutHeader title='Shift'>
                {data?.status_shift == "pending" && <UpdateShiftForm />}
                {data?.status_shift == "pending" && <EndShiftUserForm handleFetch={refresh} />}
                {data?.status_shift !== "pending" && <PrintShift />}
                {data?.status_shift !== "pending" && <CreateShiftForm />}
            </DashboardLayoutHeader>

            <div className='flex flex-wrap gap-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Saldo tersisa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getRupiahFormat(data?.cashier_balance ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Saldo awal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getRupiahFormat(data?.begining_balance ?? 0)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Pemegang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.balance_holder}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Catatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.notes ?? "--"}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default Shift
