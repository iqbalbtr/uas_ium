"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import nav from "@assets/json/nav.json"
import { Checkbox } from '@components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Switch } from '@components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import nav_content from "@/assets/json/nav.json"
import AccessCard from './AccessCard'
import { NavType } from '@components/app/app-sidebar'

function AccessDialog({ children, access, setAccess }: { children: ReactNode, access: NavType[], setAccess: Dispatch<SetStateAction<NavType[]>> }) {



    const handleCheck = (parent: string, child?: string) => {
        console.log(parent, child);
      
        if (child) {
          setAccess((prevAccess) => {
            const parentItem = prevAccess.find((navItem) => navItem.url === parent);
            const childExists = parentItem?.items?.some((item) => item.url === child);
      
            if (parentItem) {
              return childExists
                ? prevAccess.map((navItem) =>
                    navItem.url === parent
                      ? {
                          ...navItem,
                          items: navItem.items?.filter((item) => item.url !== child) || [],
                        }
                      : navItem
                  )
                : prevAccess.map((navItem) =>
                    navItem.url === parent
                      ? {
                          ...navItem,
                          items: [
                            ...(navItem.items ?? []),
                            nav_content
                              .find((nav) => nav.url === parent)
                              ?.items?.find((item) => item.url === child)!,
                          ].filter(Boolean) as NavType[],
                        }
                      : navItem
                  );
            }
      
            const parentNav = nav_content.find((nav) => nav.url === parent);
            if (parentNav) {
              return [
                ...prevAccess,
                {
                  ...parentNav,
                  items: [
                    parentNav.items?.find((item) => item.url === child)!,
                  ].filter(Boolean),
                },
              ];
            }
      
            return prevAccess;
          });
        } else {
          setAccess((prevAccess) => {
            const exists = prevAccess.some((navItem) => navItem.url === parent);
            if (exists) {
              return prevAccess.filter((navItem) => navItem.url !== parent);
            }
      
            const parentNav = nav_content.find((nav) => nav.url === parent);
            return parentNav ? [...prevAccess, { ...parentNav}] : prevAccess;
          });
        }
      };
      



    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Hak akses
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className='flex flex-wrap gap-3'>
                    {
                        nav.map((fo, i) => <AccessCard key={i} access={access} data={fo} handle={handleCheck} />)
                    }
                </div>
                <DialogFooter />
            </DialogContent>
        </Dialog>
    )
}

export default AccessDialog
