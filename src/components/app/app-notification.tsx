"use client"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, BellDot, Dot } from "lucide-react";
import NotificationsList from "./notification-content";
import { useEffect, useState } from "react";
import { getNotiUser, getNotifInterval } from "@/actions/notification";
import { Notification as NotifType } from "@models/notif";
import { usePathname } from "next/navigation";

function AppNotication() {

  const [notif, setNotif] = useState<NotifType[]>([]);
  const route = usePathname();

  async function getNotif() {
    try {
      const get = await getNotiUser()
      if (get) {
        setNotif(get as any)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    getNotif()
  }, [route])



  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          {notif.length ? <BellDot /> : <Bell />}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Semua Notifikasi</SheetTitle>
        </SheetHeader>
        <NotificationsList data={notif} setData={setNotif} />
      </SheetContent>
    </Sheet>
  );
}

export default AppNotication;
