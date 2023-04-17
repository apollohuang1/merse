"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { allCreateRoutes } from "@/util/create-constants";
import useColorScheme from "@/hooks/useColorScheme";
import { Spinner } from "@chakra-ui/react";

type Props = {};

const CreateLeftSideBar = (props: Props) => {
  
  const pathName = usePathname();

  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <div className="flex flex-col justify-between w-full h-full border-x border-x-light-divider dark:border-x-dark-divider pt-16">
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

      {/* discard button */}
      <div className="flex flex-row border-t border-t-light-divider dark:border-t-dark-divider">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="h-16 w-full hover:bg-light-red dark:hover:bg-dark-red hover:bg-opacity-30 dark:hover:bg-opacity-30"
        >
          <span className="font-semibold text-light-red dark:text-dark-red">Discard</span>
        </button>

        <button
          onClick={() => {
            // window.location.href = "/";
            setIsSaving(true);

            setTimeout(() => {
              setIsSaving(false);
              window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }, 2000);
            
          }}
          className="flex flex-row h-16 w-full hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary border-l border-l-light-divider dark:border-l-dark-divider items-center justify-center gap-2"
        >
          { isSaving && <Spinner className="w-4 h-4" />}
          <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

    </div>
  );
};

export default CreateLeftSideBar;
