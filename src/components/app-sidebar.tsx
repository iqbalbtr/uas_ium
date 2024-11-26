"use client";

import * as React from "react";
import {
  AudioWaveform,
  BedIcon,
  BriefcaseMedical,
  Computer,
  HousePlus,
  ScrollText,
  UserCog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "Admin tester",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Kasir",
      icon: Computer,
      url: "/dashboard/kasir",
      isParent: true,
    },
    {
      title: "Obat",
      url: "/dashboard/obat",
      icon: BriefcaseMedical,
      isActive: false,
      items: [
        {
          title: "Obat Master",
          url: "/dashboard/obat/master",
        },
        {
          title: "Pemesanan",
          url: "/dashboard/obat/pemesanan",
        },
        {
          title: "Penerimaan",
          url: "/dashboard/obat/penerimaan",
        },
        {
          title: "Racikan",
          url: "/dashboard/obat/racikan",
        },
      ],
    },
    {
      title: "Laporan",
      url: "/dashboard/laporan",
      icon: ScrollText,
      items: [
        {
          title: "Penjualan",
          url: "/dashboard/laporan/penjualan",
        },
        {
          title: "Pembelian",
          url: "/dashboard/laporan/pembelian",
        },
        {
          title: "Laba Rugi",
          url: "/dashboard/laporan/laba-rugi",
        },
      ],
    },
    {
      title: "User",
      url: "/dashboard/user",
      icon: UserCog,
      items: [
        {
          title: "User Master",
          url: "/dashboard/user/master",
        },
        {
          title: "Role Master",
          url: "/dashboard/user/role",
        },
      ],
    },
    {
      title: "Apotek",
      url: "/dashboard/apotek",
      icon: HousePlus,
      items: [
        {
          title: "Informasi",
          url: "/dashboard/apotek/informasi",
        },
        {
          title: "Ubah",
          url: "/dashboard/apotek/ubah",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="flex justify-start gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center rounded-md ">
            <Image src="/images/logo.jpg" width={40} height={40} alt="apotek" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Apotek Empat Husada</span>
            <span className="truncate text-xs">Husada Group</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
