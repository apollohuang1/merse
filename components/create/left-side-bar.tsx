"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { FiMoreHorizontal } from "react-icons/fi";
import { Switch } from "@headlessui/react";

type Props = {};

const createRoutes = [
  // character, storyboard, cover, styles, review.
  {
    pathname: "/create/characters",
    path: "Characters",
  },
  {
    pathname: "/create/storyboard",
    path: "Storyboard",
  },
  {
    pathname: "/create/cover",
    path: "Cover",
  },
  {
    pathname: "/create/styles",
    path: "Styles",
  },
  {
    pathname: "/create/review",
    path: "Review",
  },
];

const LeftSideBar: React.FC<{}> = ({}) => {


  const pathName = usePathname();

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleColorSchemToLight = () => {
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
  };

  const toggleColorSchemeToDark = () => {
    document.documentElement.classList.add("dark");
    setIsDarkMode(true);
  };


  // useEffect(() => {
  //   // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }

  //   // // Whenever the user explicitly chooses light mode
  //   // localStorage.theme = "light";

  //   // // Whenever the user explicitly chooses dark mode
  //   // localStorage.theme = "dark";

  //   // // Whenever the user explicitly chooses to respect the OS preference
  //   // localStorage.removeItem("theme");

  // }, []);

  return (
    <div className="flex flex-col justify-between w-full h-full border-r border-r-light-divider dark:border-r-dark-divider pt-16 bg-light-background-secondary dark:bg-dark-background-secondary">
      <div className="border-t border-t-light-divider dark:border-t-dark-divider">
        {createRoutes.map((route, index) => {
          return (
            <Link key={index} href={route?.pathname}>
              <button
                className={clsx(
                  "flex items-center justify-center w-full h-16 border-b border-b-light-divider dark:border-b-dark-divider transition-all active:opacity-50",
                  // { 'hover:dark:bg-dark-background-secondary hover:bg-light-background-secondary': !isActive },
                  {
                    "bg-light-background-tertiary dark:bg-dark-background-tertiary text-light-text-primary dark:text-dark-text-primary":
                      pathName === route.pathname,
                  },
                  {
                    "text-light-text-tertiary dark:text-dark-text-tertiary":
                      pathName !== route.pathname,
                  }
                )}
              >
                <span className="font-semibold">{route.path}</span>
              </button>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col">
        {/* toggle color scheme row with tailwind headless ui toggle button */}

        <div className="flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider">

          <div className="flex flex-row gap-3 items-center">
            <div className="flex flex-col gap-0 items-start">
              <span className="text-sm">Dark Mode</span>
            </div>
          </div>

          {/* <div className='flex flex-row gap-3 items-center'>
            <div className='flex flex-col gap-0 items-start'>
              <button 
                className='text-sm'
                onClick={() => {
                  toggleColorScheme();
                }}
              >
                Toggle
              </button>
            </div>
          </div> */}

          <Switch
            checked={true}
            onChange={(checked) => {
              if (isDarkMode) {
                toggleColorSchemToLight();
              } else {
                toggleColorSchemeToDark();
              }
            }}
            className={clsx(
              isDarkMode ? "bg-emerald-500" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={clsx(
                isDarkMode ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>

        <button className="flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary">
          <div className="flex flex-row gap-3 items-center">
            {/* @ts-ignore */}
            <img
              src="https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg"
              className="rounded-full w-9 h-9"
              alt="profile image"
            />

            <div className="flex flex-col gap-0 items-start">
              <span className="text-sm">Mark</span>
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
