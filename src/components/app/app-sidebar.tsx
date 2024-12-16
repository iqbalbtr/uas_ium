import * as React from "react";
import {
  ChevronsUpDown,
  LucideAArrowUp,
} from "lucide-react";
import { NavMain } from "@components/navbar/nav-main";
import { NavUser } from "@components/navbar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { getRoleById } from "@/actions/role";
import useLoading from "@hooks/use-loading";
import Loading from "@components/ui/loading";
import Image from "next/image";
import useFetch from "@hooks/use-fetch";
import { getApotek } from "@/actions/apotek";
import Link from "next/link";


export interface NavType {
  title: string;
  icon: string;
  url: string;
  isParent?: boolean;
  isActive?: boolean;
  items?: Item[];
}

export interface Item {
  title: string;
  url: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [sideData, setSideData] = React.useState<NavType[]>([])
  const { data: apotek } = useFetch({ defaultValue: undefined, url: getApotek })
  const { isLoading, setLoading } = useLoading()

  const { data } = useSession()

  async function getSideData() {
    setLoading("loading")
    try {
      const get = await getRoleById(data?.user.roleId!)
      if (get) {
        setSideData(get.access_rights as NavType[])
      }
    } catch (error) {

    } finally {
      setLoading("idle")
    }
  }

  React.useEffect(() => {
    if (data?.user.roleId) {
      getSideData()
    }
  }, [data])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/dashboard"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Image width={100} height={100} className="h-full object-cover" alt="logo.jpg" src={"/logo.jpg"} decoding="async" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {apotek?.name}
              </span>
              <span className="truncate text-xs">{apotek?.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {isLoading == "loading" ? <Loading className="p-6" isLoading={isLoading} /> : <NavMain items={sideData} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
