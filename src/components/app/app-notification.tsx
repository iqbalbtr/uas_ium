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

function AppNotication() {
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
          <SheetDescription>
            <NotificationsList />
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">{/* Content  */}</div>
        <SheetFooter>
          <SheetClose asChild>
            <span>Footer</span>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AppNotication;
