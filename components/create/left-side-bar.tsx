"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { FiMoreHorizontal } from "react-icons/fi";
import { Menu } from "@headlessui/react";
import { allCreateRoutes } from "@/util/create-constants";

type Props = {};

const LeftSideBar: React.FC<{}> = ({}) => {
  const pathName = usePathname();

  const toggleColorSchemToLight = () => {
    document.documentElement.classList.remove("dark");
    // setIsDarkMode(false);
    localStorage.theme = "light";
  };

  const toggleColorSchemeToDark = () => {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    // setIsDarkMode(true);
  };

  const toggleColorScheme = () => {
    if (localStorage.theme === "dark") {
      toggleColorSchemToLight();
    } else {
      toggleColorSchemeToDark();
    }
  };

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
                    "bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary transition-all text-lg border-r-2 border-r-emerald-500":
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

      <div className="flex flex-col">
        {/* toggle color scheme row with tailwind headless ui toggle button */}

        <button
          onClick={() => {
            toggleColorScheme();
          }}
          className="flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary w-full"
        >
          <span className="text-sm">Dark Mode</span>
          <FiMoreHorizontal className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
        

        <button className="flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary">
          <div className="flex flex-row gap-3 items-center">
            <img
              src="https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg"
              className="rounded-full w-9 h-9 object-cover"
              alt="profile image"
            />

            <div className="flex flex-col gap-0 items-start">
              <span className="text-sm">Comics</span>
              <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                Edit Profile
              </span>
            </div>
          </div>

          <FiMoreHorizontal className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;
