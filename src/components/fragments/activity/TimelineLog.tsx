"use client";
import { useEffect, useState } from "react";
import { getUserActivity } from "@/actions/activity-log";
import { ActivityLog } from "@models/log";
import { Button } from "@components/ui/button";
import useLoading from "@hooks/use-loading";
import Loading from "@components/ui/loading";
import TimeLineCard from "@components/fragments/activity/TimeLineCard";
import { useSession } from "next-auth/react";
import { months } from "@/constants/date";

export type ActivityType = {
  id: string;
  date: string;
  data: ActivityLog[];
}

export default function TimelineLog() {
  const [timeline, setTimeline] = useState<ActivityType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const { isLoading, setLoading } = useLoading();
  const { data: session } = useSession();


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


  async function fetchTimeline(reset: boolean) {
    try {
      setLoading("loading");
      const response = await getUserActivity(session?.user.id!, currentPage + 1, 5);

      if (response) {

        insertData(response.result)
        setCurrentPage(response.pagging.page);
        setIsEnd(response.pagging.page >= response.pagging.total_page);
      }
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
    } finally {
      setLoading("idle");
    }
  }

  useEffect(() => {
    if (session) {
      fetchTimeline(true);
    }
  }, [session]);

  return (
    <div className="mx-auto p-4 border flex flex-col rounded-lg">
      {timeline.map((item, index) => (
        <TimeLineCard data={item} key={index} />
      ))}
      {isLoading === "loading" && (
        <div className="w-full flex justify-center">
          <Loading isLoading={isLoading} type="loader" />
        </div>
      )}
      {!isEnd && isLoading !== "loading" && (
        <Button variant="outline" className="mt-6" onClick={() => fetchTimeline(false)}>
          Load More
        </Button>
      )}
    </div>
  );
}
