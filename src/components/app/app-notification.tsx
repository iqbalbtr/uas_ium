"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import NotificationsList from "./notification-content";
import { useEffect } from "react";
import { sendMessage } from "@/actions/notification";
import useFCMToken from "@hooks/use-fcm-token";
import { getMessaging, onMessage } from "firebase/messaging";
import firebaseApp from "@libs/firebase";
import { useSession } from "next-auth/react";

function AppNotication() {

  const {premission, token} = useFCMToken();
  const data = useSession()
  console.log(data);
  

  async function send() {
    await sendMessage({
      body: "Halo",
      title: "mantap"
    })
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Bell />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>All noricication</SheetTitle>
        </SheetHeader>
        <NotificationsList />
        <SheetFooter>
          <SheetClose asChild>
            <span>Footer</span>
          </SheetClose>
          <Button onClick={send}>Test</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AppNotication;
