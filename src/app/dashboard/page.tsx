"use client"
import { Activity, DollarSign, Package, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getData } from "@/actions/dashboard";
import CategoryChart from "@components/fragments/dashboard/CategoryChart";
import useFetch from "@hooks/use-fetch";
import RecentActivity from "@components/fragments/dashboard/RecentActivity";
import RecentTransaction from "@components/fragments/dashboard/RecentTransaction";
import OrderSellStatistic from "@components/fragments/dashboard/OrderSellStatistic";

export default function DashboardContent() {

  const { data: total } = useFetch<{
    totalMedicine: number;
    totalOrder: number;
    totalRole: number;
    totalTransaction: number;
    totalUser: number
  }>({
    defaultValue: {
      totalMedicine: 0,
      totalOrder: 0,
      totalRole: 0,
      totalTransaction: 0,
      totalUser: 0
    },
    url: getData
  })



  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-purple-100 dark:bg-purple-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{total?.totalUser ?? 0}</div>
            <p className="text-xs text-purple-600/80">Seluruh pengguna</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 dark:bg-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Obat
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{total?.totalMedicine ?? 0}</div>
            <p className="text-xs text-blue-600/80">Seluruh obat ini</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-100 dark:bg-rose-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pembelian
            </CardTitle>
            <DollarSign className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{total?.totalOrder ?? 0}</div>
            <p className="text-xs text-rose-600/80">Bulan ini</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 dark:bg-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Role
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{total?.totalRole ?? 0}</div>
            <p className="text-xs text-orange-600/80">Seluruh role</p>
          </CardContent>
        </Card>
        <Card className="bg-green-100 dark:bg-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total transaksi</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{total?.totalTransaction ?? 0}</div>
            <p className="text-xs text-green-600/80">Transaksi Bulan ini</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OrderSellStatistic />
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Analisis Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <CategoryChart />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
        <RecentTransaction />
      </div>
    </div>
  );
}
