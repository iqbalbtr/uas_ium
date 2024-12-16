"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

function NavBreadCrumb() {
  const pathname = usePathname();
  const [path, setPath] = useState<{ label: string; path: string, index: string }[]>([]);

  function handle() {
    const path = pathname.split("/");

    return path.map((fo, i) => {
      const firstChar = fo.charAt(0).toUpperCase();
      const iPath = path.slice(0, i+1)
      return {
        label: firstChar + fo.slice(1),
        path: iPath.join("/"),
        index: fo
      };
    });
  }  

  useEffect(() => {
    setPath([...handle()]);
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((fo, i) => (
          <Link href={i !== 2 ? fo.path : "#"} key={i} className="flex items-center justify-center gap-2">
            <BreadcrumbItem className={i == path.length - 1 ? "" : ""}>
              <BreadcrumbPage>{fo.label}</BreadcrumbPage>
            </BreadcrumbItem>
            {i < path.length - 1 && i > 0 && <BreadcrumbSeparator />}
          </Link>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default NavBreadCrumb;
