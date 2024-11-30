import { Activity, DollarSign, Package, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AnalyticsDonutChart from "@components/chart/pie-chart";

// Sample data for the line chart
const lineChartData = [
  { name: "Jan", Sales: 4000, Orders: 2400 },
  { name: "Feb", Sales: 3000, Orders: 1398 },
  { name: "Mar", Sales: 2000, Orders: 9800 },
  { name: "Apr", Sales: 2780, Orders: 3908 },
  { name: "May", Sales: 1890, Orders: 4800 },
];

// Sample data for the pie chart
const pieChartData = [
  { name: "Sale", value: 400 },
  { name: "Distribute", value: 300 },
  { name: "Return", value: 300 },
];

const COLORS = ["#8884d8", "#ffc658", "#ff8042"];

export default function DashboardContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-purple-100 dark:bg-purple-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">178+</div>
            <p className="text-xs text-purple-600/80">Active Projects</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 dark:bg-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Products
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">20+</div>
            <p className="text-xs text-blue-600/80">In warehouse</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-100 dark:bg-rose-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales Products
            </CardTitle>
            <DollarSign className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">190+</div>
            <p className="text-xs text-rose-600/80">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 dark:bg-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12+</div>
            <p className="text-xs text-orange-600/80">New today</p>
          </CardContent>
        </Card>
        <Card className="bg-green-100 dark:bg-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82</div>
            <p className="text-xs text-green-600/80">Current users</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie chart */}
        <Card className="col-span-3">
          <AnalyticsDonutChart />
        </Card>
        {/* Order Status */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>12398</TableCell>
                  <TableCell>Charity Joan</TableCell>
                  <TableCell>$2450</TableCell>
                  <TableCell>
                    <Badge className="bg-rose-500">Process</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>12399</TableCell>
                  <TableCell>Charity Joan</TableCell>
                  <TableCell>$2450</TableCell>
                  <TableCell>
                    <Badge className="bg-purple-500">Done</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Line chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="Sales"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="Orders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Task Updated</p>
                  <p className="text-xs text-muted-foreground">45 Min Ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Deal Added</p>
                  <p className="text-xs text-muted-foreground">3 Day Ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Published Article</p>
                  <p className="text-xs text-muted-foreground">45 Min Ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
