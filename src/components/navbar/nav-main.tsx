"use client"

import { ChevronRight, Icon, type LucideIcon, icons } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavType } from "@components/app/app-sidebar"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: NavType[]
}) {

  function Icon({ name }: { name: keyof typeof icons }) {
    const Res = icons[name]

    return <Res />
  }
  const pathname = usePathname()  


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={pathname == item.url ? true : (item.url == (pathname.split("/").slice(0,3).join("/")))} tooltip={item.title}>
                  {item.icon && <Icon name={item.icon as keyof typeof icons} />}
                  {
                    item.isParent ?
                      <Link href={item.url}>{item.title}</Link> :
                      <span>{item.title}</span>
                  }
                  {!item.isParent && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {
                !item.isParent && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton isActive={pathname == subItem.url} asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )
              }
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
