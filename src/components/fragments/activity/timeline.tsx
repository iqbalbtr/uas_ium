import { CalendarClock, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  date: string;
  time: string;
  type: "TASK ADDED" | "DEAL ADDED" | "EVENT COMPLETED";
  description: string;
}

export interface TimelineMonth {
  month: string;
  items: TimelineItem[];
}

interface TimelineProps {
  data: TimelineMonth[];
}

export function Timeline({ data }: TimelineProps) {
  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "TASK ADDED":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "DEAL ADDED":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "EVENT COMPLETED":
        return <CalendarClock className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeColor = (type: TimelineItem["type"]) => {
    switch (type) {
      case "TASK ADDED":
        return "text-blue-500";
      case "DEAL ADDED":
        return "text-green-500";
      case "EVENT COMPLETED":
        return "text-purple-500";
    }
  };

  return (
    <div className="space-y-8">
      {data.map((month, monthIndex) => (
        <Card key={monthIndex}>
          <CardHeader>
            <CardTitle>{month.month}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {month.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:w-24">
                    <div className="text-sm font-medium">{item.date}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getIcon(item.type)}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          getTypeColor(item.type)
                        )}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
