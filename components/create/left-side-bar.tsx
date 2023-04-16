"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { allCreateRoutes } from "@/util/create-constants";
import useColorScheme from "@/hooks/useColorScheme";

type Props = {};

const LeftSideBar = (props: Props) => {
  
  const pathName = usePathname();

  return (
    <div className="flex flex-col justify-between w-full h-full border-r border-r-light-divider dark:border-r-dark-divider pt-16">
      <div className="flex flex-col gap-0">
        { allCreateRoutes.map((route, index) => {
          return (
            <Link key={index} href={route?.pathname}>
              <button
                className={clsx(
                  "flex items-center justify-center w-full h-16 transition-all active:opacity-50",
                  {
                    "bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary transition-all text-lg border-r-2 border-r-accent":
                      pathName === route.pathname,
                  },
                  {
                    "text-light-text-tertiary dark:text-dark-text-tertiary":
                      pathName !== route.pathname,
                  }
                )}
              >
                <span className="font-semibold">{route?.title}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSideBar;
