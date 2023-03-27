"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { FiMoreHorizontal } from "react-icons/fi";
import { Menu } from "@headlessui/react";

type Props = {};

const createRoutes = [
  // character, storyboard, cover, styles, review.
  {
    pathname: "/create/styles",
    path: "Styles",
  },
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
    pathname: "/create/review",
    path: "Review",
  },
];

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
    <div className="flex flex-col justify-between w-full h-full border-r border-r-light-divider dark:border-r-dark-divider pt-16">
      <div className="border-t border-t-light-divider dark:border-t-dark-divider">
        { createRoutes.map((route, index) => {
          return (
            <Link key={index} href={route?.pathname}>
              <button
                className={clsx(
                  "flex items-center justify-center w-full h-16 border-b border-b-light-divider dark:border-b-dark-divider transition-all active:opacity-50",
                  // { 'hover:dark:bg-dark-background-secondary hover:bg-light-background-secondary': !isActive },
                  {
                    "bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary transition-all text-lg":
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
