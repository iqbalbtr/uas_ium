"use client"
import { getDifferenceIncome, getLatestShift } from "@/actions/shift";
import CreateShiftForm from "@components/fragments/shift/CreateShiftForm";
import EndShiftUserForm from "@components/fragments/shift/EndShiftUserForm";
import ShiftStatistic from "@components/fragments/shift/ShiftStatistic";
import UpdateNote from "@components/fragments/shift/UpdateNote";
import UpdateShiftForm from "@components/fragments/shift/UpdateShiftForm";
import DashboardLayout, { DashboardLayoutHeader } from "@components/layouts/DashboardLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import useFetch from "@hooks/use-fetch";
import { getDateFormat, getRupiahFormat } from "@libs/utils";
import { Wallet2 } from "lucide-react";
import React from "react";

function Shift() {

    const { data, isLoading, refresh } = useFetch({
        url: getLatestShift,
        defaultValue: undefined
    })

    return (
        <DashboardLayout>
            <DashboardLayoutHeader title="Shift">
                {data?.status_shift == "pending" && <UpdateShiftForm currSaldo={data.begining_balance} handleFetch={refresh} />}
                {data?.status_shift == "pending" && <EndShiftUserForm notes={data.notes!} handleFetch={refresh} />}
                {(data?.end_shift || !data)  && <CreateShiftForm handleFetch={refresh} />}
            </DashboardLayoutHeader>

            <div className="grid md:grid-cols-5 grid-rows-5 md:grid-rows-6 gap-3">

                <Card className="bg-purple-100 flex flex-col justify-between dark:bg-purple-900/20 col-span-1 md:col-span-2 md:row-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Waktu Mulai</CardTitle>
                        <Wallet2 size={30} className=" text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-600">{getDateFormat(data?.start_shift!, "-")}</div>
                        <p className="text-base pt-2 text-purple-600/80">{String(data?.start_shift?.getHours()).padStart(2, "0")}:{String(data?.start_shift?.getMinutes()).padStart(2,"0")}</p>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-100 flex flex-col justify-between dark:bg-indigo-900/20 col-span-1 md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 row-start-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Saldo Awal</CardTitle>
                        <Wallet2 size={30} className=" text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-indigo-600">{getRupiahFormat(data?.begining_balance ?? 0)}</div>
                        <p className="text-base pt-2 text-indigo-600/80">Saldo saat ini</p>
                    </CardContent>
                </Card>



                <Card className="bg-emerald-100 flex flex-col justify-between dark:bg-emerald-900/20 col-span-1 md:row-span-2 md:col-start-5 row-start-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Pemegang</CardTitle>
                        <Wallet2 size={30} className=" text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-emerald-600">{data?.holder?.username ?? "--"}</div>
                        <p className="text-base pt-2 text-emerald-600/80">Pemegang saldo</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 md:row-span-4 relative  bg-yellow-100">
                    <CardHeader>
                        <CardTitle>Catatan</CardTitle>
                    </CardHeader>
                        <UpdateNote note={data?.notes ?? ""} refresh={refresh} />
                    <CardContent>
                        {data?.notes ?? "--"}
                    </CardContent>
                </Card>

                <ShiftStatistic />
            </div>
        </DashboardLayout> 
    );
}
export default Shift;
