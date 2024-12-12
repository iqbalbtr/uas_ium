import { CalendarClock, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  date: string;
  time: string;
  type: "TASK ADDED" | "DEAL ADDED" | "EVENT COMPLETED";
  description: string;
}

interface TimelineMonth {
  month: string;
  items: TimelineItem[];
}

export default function TimelineLog() {
  const timelineData: TimelineMonth[] = [
    {
      month: "August, 2016",
      items: [
        {
          date: "12 Aug",
          type: "TASK ADDED",
          description:
            "Prepare for a bi-weekly meeting to discuss new features",
          time: "09:30am",
        },
        {
          date: "10 Aug",
          type: "DEAL ADDED",
          description:
            "Deal for the property in Malibu with Casey Brother Real Estate",
          time: "11:30am",
        },
        {
          date: "10 Aug",
          type: "EVENT COMPLETED",
          description: "Meet with Claudia in the «Coffee Caldo» for Brunch",
          time: "11:30am",
        },
      ],
    },
    {
      month: "July, 2016",
      items: [
        {
          date: "12 Aug",
          type: "TASK ADDED",
          description:
            "Prepare for a bi-weekly meeting to discuss new features",
          time: "09:30am",
        },
        {
          date: "10 Aug",
          type: "DEAL ADDED",
          description:
            "Deal for the property in Malibu with Casey Brother Real Estate",
          time: "11:30am",
        },
        {
          date: "10 Aug",
          type: "EVENT COMPLETED",
          description: "Meet with Claudia in the «Coffee Caldo» for Brunch",
          time: "11:30am",
        },
      ],
    },
  ];

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
    <div className="max-w-2xl mx-auto p-4">
      {timelineData.map((month, monthIndex) => (
        <div key={monthIndex} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{month.month}</h2>
          <div className="border-l-2 border-gray-200">
            {month.items.map((item, itemIndex) => (
              <div key={itemIndex} className="relative pl-4 pb-8 last:pb-0">
                <div className="absolute left-[-5px] w-2 h-2 rounded-full bg-white border-2 border-gray-200" />
                <div className="flex items-start gap-3">
                  <div className="min-w-[60px] text-sm text-gray-500">
                    {item.date}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      {getIcon(item.type)}
                      <span
                        className={cn("font-medium", getTypeColor(item.type))}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm mb-1">{item.description}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
