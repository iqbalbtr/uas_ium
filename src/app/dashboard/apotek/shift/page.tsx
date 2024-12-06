import { getLatestShift } from '@/actions/shift'
import CreateShiftForm from '@components/fragments/shift/CreateShiftForm'
import EndShiftUserForm from '@components/fragments/shift/EndShiftUserForm'
import UpdateShiftForm from '@components/fragments/shift/UpdateShiftForm'
import DashboardLayout, { DashboardLayoutHeader } from '@components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { getRupiahFormat } from '@libs/utils'
import React from 'react'

async function Shift() {

    const shift = await getLatestShift()

    return (
        <DashboardLayout>
            <DashboardLayoutHeader title='Shift'>
                {shift?.status_shift == "pending" && <UpdateShiftForm />}
                {shift?.status_shift == "pending" && <EndShiftUserForm />}
                {shift?.status_shift !== "pending" && <CreateShiftForm />}
            </DashboardLayoutHeader>

            <div className='flex flex-wrap gap-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Saldo tersisa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getRupiahFormat(shift?.cashier_balance ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Saldo awal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getRupiahFormat(shift?.begining_balance ?? 0)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Pemegang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shift?.balance_holder}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Catatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shift?.notes ?? "--"}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default Shift
