"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Total Direct", value: 234 },
  { name: "Total Revenue", value: 514 },
  { name: "Total Unused", value: 345 },
];

const COLORS = ["#1d1d1d", "#2563eb", "#e2e8f0"];

export default function AnalyticsDonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = (total / 1000).toFixed(2);

  return (
    <div>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    className="stroke-background hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{formattedTotal}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-4 space-y-2">
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
      </CardContent>
    </div>
  );
}
