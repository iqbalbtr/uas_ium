"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserActivity } from "@/actions/activity-log";
import useLoading from "@hooks/use-loading";
import TimeLineCard from "./TimeLineCard";
import { ActivityType } from "@components/fragments/activity/TimelineLog";
import { ActivityLog } from "@models/log";
import { months } from "@/constants/date";
import Loading from "@components/ui/loading";


export function TimelineDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  const [timeline, setTimeline] = useState<ActivityType[]>([]);
  const [paggig, setPagging] = useState(0);
  const [isEnd, setEnd] = useState(false);
  const { isLoading, setLoading } = useLoading()


  function insertData(actList: ActivityLog[]) {
    actList.forEach(act => {
      setTimeline((pv) => {
        const date = new Date(act.date);

        const id = `${date.getMonth() + 1}${date.getDate()}`;

        const formattedDate = `${date.getDate()}, ${months[date.getMonth()]}`;

        const isExisting = pv.find((fo) => fo.id === id);

        const payload: ActivityType = {
          id,
          date: formattedDate,
          data: isExisting ? [...isExisting.data, act] : [act],
        };

        return isExisting ? pv.map(fo => fo.id === id ? payload : fo) :
          [...pv, payload]
      });
    })
  }

  async function getTimeline() {
    try {
      setLoading("loading")
      const get = await getUserActivity(id, paggig + 1, 5);
      if (get) {
        insertData(get.result)
        setEnd(get.pagging.total_page === (paggig + 1));
        setPagging(get.pagging.page);
      }
    } catch (error) {
    } finally {
      setLoading("idle")
    }
  }

  useEffect(() => {
    getTimeline()
  }, [])

  console.log(isLoading);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Lihat Aktifitas</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[550px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-6">Log Aktifitas</DialogTitle>
        </DialogHeader>
        <div>
          {timeline.map((fo, i) => <TimeLineCard key={i} data={fo} />)}
        </div>
        <DialogFooter>
          {!isEnd && <Button variant={"outline"} disabled={isLoading == "loading"} onClick={() => getTimeline()}><Loading isLoading={isLoading}>Muat Lagi</Loading></Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
