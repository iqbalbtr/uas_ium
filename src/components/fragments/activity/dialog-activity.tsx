"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Timeline, TimelineMonth } from "./timeline";

const timelineData: TimelineMonth[] = [
  {
    month: "August, 2016",
    items: [
      {
        date: "12 Aug",
        type: "TASK ADDED",
        description: "Prepare for a bi-weekly meeting to discuss new features",
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
        description: "Prepare for a bi-weekly meeting to discuss new features",
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

export function TimelineDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Timeline</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity Timeline</DialogTitle>
        </DialogHeader>
        <Timeline data={timelineData} />
      </DialogContent>
    </Dialog>
  );
}
