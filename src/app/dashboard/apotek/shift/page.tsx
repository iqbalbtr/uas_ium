"use client"
import { getDifferenceIncome, getLatestShift } from "@/actions/shift";
import CreateShiftForm from "@components/fragments/shift/CreateShiftForm";
import EndShiftUserForm from "@components/fragments/shift/EndShiftUserForm";
import ShiftStatistic from "@components/fragments/shift/ShiftStatistic";
import UpdateNote from "@components/fragments/shift/UpdateNote";
import UpdateShiftForm from "@components/fragments/shift/UpdateShiftForm";
import DashboardLayout, {
    DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import useFetch from "@hooks/use-fetch";
import { getRupiahFormat } from "@libs/utils";
import { Pen, Wallet2 } from "lucide-react";
import React from "react";

function Shift() {

    const { data, isLoading, refresh } = useFetch({
        url: getLatestShift,
        defaultValue: undefined
    })

    return (
        <DashboardLayout>
            <DashboardLayoutHeader title="Shift">
                {data?.status_shift == "pending" && <UpdateShiftForm handleFetch={refresh} />}
                {data?.status_shift == "pending" && <EndShiftUserForm handleFetch={refresh} />}
                {data?.status_shift !== "pending" && <CreateShiftForm handleFetch={refresh} />}
            </DashboardLayoutHeader>

            <div className="grid grid-cols-5 grid-rows-6 gap-3">

                <Card className="bg-purple-100 flex flex-col justify-between dark:bg-purple-900/20 col-span-2 row-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Saldo</CardTitle>
                        <Wallet2 size={30} className=" text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-600">{getRupiahFormat(data?.cashier_balance ?? 0)}</div>
                        <p className="text-base pt-2 text-purple-600/80">Saldo saat ini</p>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-100 flex flex-col justify-between dark:bg-indigo-900/20 col-span-2 row-span-2 col-start-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Saldo Awal</CardTitle>
                        <Wallet2 size={30} className=" text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-indigo-600">{getRupiahFormat(data?.begining_balance ?? 0)}</div>
                        <p className="text-base pt-2 text-indigo-600/80">Saldo saat ini</p>
                    </CardContent>
                </Card>



                <Card className="bg-emerald-100 flex flex-col justify-between dark:bg-emerald-900/20  row-span-2 col-start-5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Pemegang</CardTitle>
                        <Wallet2 size={30} className=" text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-emerald-600">{data?.holder?.name ?? "--"}</div>
                        <p className="text-base pt-2 text-emerald-600/80">Pemegang saldo</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3 row-span-4 relative row-start-3 bg-yellow-100">
                    <CardHeader>
                        <CardTitle>Catatan</CardTitle>
                    </CardHeader>
                        <UpdateNote note={data?.notes ?? ""} refresh={refresh} />
                    <CardContent>
                        {data?.notes ?? "--"}
                    </CardContent>
                </Card>

                {/* Chart */}
                <ShiftStatistic />
            </div>
        </DashboardLayout>
    );
}
export default Shift;
