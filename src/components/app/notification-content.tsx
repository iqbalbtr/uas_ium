"use client"
import { deleteNotif } from "@/actions/notification";
import { Card } from "@/components/ui/card";
import useLoading from "@hooks/use-loading";
import { toast } from "@hooks/use-toast";
import { formatCurrentTime } from "@libs/utils";
import { Notification } from "@models/notif";
import { CircleX, Pill } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function NotificationsList({
  data,
  setData
}: {
  data: Notification[];
  setData: Dispatch<SetStateAction<Notification[]>>
}) {

  const {isLoading, setLoading} = useLoading();

  async function handleDelete(id: number) {
    try {
      setLoading("loading")      
      const res = await deleteNotif(id)
      setData(pv => pv.filter(fo => fo.id !== id))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message
      })
    }finally{
      setLoading("idle")
    }
  }

  return (
    <div className="w-full space-y-4 p-4 overflow-y-auto">
      {
        data.map(fo => (
          <Card key={fo.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2">
                <Pill className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex justify-between w-full items-center gap-2">
                    <h3 className="font-semibold">{fo.title}</h3>
                    <button onClick={() => handleDelete(fo.id)} className=" p-.5 cursor-pointer rounded-full"><CircleX className="text-red-600" size={15} /></button>
                  </div>
                  <span className="text-sm text-gray-500"></span>
                </div>
                <p className="mt-1 text-gray-600">
                 {fo.description}
                </p>
                <div className="flex items-center justify-end pt-2">
                  <p className="text-xs text-slate-500">{formatCurrentTime(fo.date)}</p>
                </div>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  );
}
