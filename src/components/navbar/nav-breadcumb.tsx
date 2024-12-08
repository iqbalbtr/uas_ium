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

function NavBreadCrumb() {
  const pathname = usePathname();
  const [path, setPath] = useState<{ label: string; path: string, index: string }[]>([]);

  function handle() {
    const path = pathname.split("/");

    return path.map((fo) => {
      const firstChar = fo.charAt(0).toUpperCase();
      return {
        label: firstChar + fo.slice(1),
        path: "",
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
          <span key={i} className="flex items-center justify-center gap-2">
            <BreadcrumbItem className={i == path.length - 1 ? "" : ""}>
              <BreadcrumbPage>{fo.label}</BreadcrumbPage>
            </BreadcrumbItem>
            {i < path.length - 1 && i > 0 && <BreadcrumbSeparator />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default NavBreadCrumb;
