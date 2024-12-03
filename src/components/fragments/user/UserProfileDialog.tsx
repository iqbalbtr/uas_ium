import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { BadgeCheck } from "lucide-react";
import React, { useState } from "react";
import UserProfileContent from "./UserProfileContent";

function UserProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-2 w-full py-2 flex gap-2 items-center">
          <BadgeCheck size={18} />
          Account
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <UserProfileContent />
      </DialogContent>
    </Dialog>
  );
}

export default UserProfileDialog;
