import React, { Children } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import {
  FiChevronsLeft,
  FiFeather,
  FiHome,
  FiMenu,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSidebar,
} from "react-icons/fi";
import Link from "next/link";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // redux
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  const [showFullSidebar, setShowFullSidebar] = React.useState(true);

  const toggleSidebar = () => {
    setShowFullSidebar(!showFullSidebar);
  };

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen">
      <div
        className={clsx(
          "w-full h-full",
          { "flex flex-col": !auth?.currentUser }, // unauthenticated
          {
            "grid grid-cols-[80px_auto] duration-300":
              auth?.currentUser && !showFullSidebar,
          }, // authenticated, hide sidebar
          {
            "grid grid-cols-[250px_auto] duration-300":
              auth?.currentUser && showFullSidebar,
          } // authenticated, show sidebar
        )}
      >
        {/* left side bar */}
        {auth?.currentUser && (
          <div className="flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-start border-r border-r-light-divider dark:border-dark-divider">
            {/* sidebar show toggle button */}
            <div
              className={clsx(
                "flex h-navigationBar w-full items-center p-3 duration-300",
                { "justify-end": showFullSidebar },
                { "justify-center": !showFullSidebar }
              )}
            >
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className="flex w-10 h-10 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary items-center justify-center rounded-full"
              >
                {showFullSidebar ? (
                  <FiChevronsLeft className="text-light-text-secondary dark:text-dark-text-secondary w-5 h-5" />
                ) : (
                  <FiMenu className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                )}
              </button>
            </div>

            {/* side menus */}

            <div className="flex flex-col w-full p-3 gap-2 items-center">
              {/* home */}
              <SidebarMenuButton
                icon={<FiHome />}
                label="Home"
                href="/"
                isFull={showFullSidebar}
              />

              {/* subscription */}
              <SidebarMenuButton
                icon={<FiFeather />}
                label="Subscription"
                href="/"
                isFull={showFullSidebar}
              />
            </div>

            {/* create */}
          </div>
        )}

        <div className="h-screen w-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};

const SidebarMenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  href: string;
  isFull: boolean;
  variant?: "normal" | "solid";
}> = ({ icon, label, href, isFull, variant="normal" }) => {
  return (
    <Link href={href} className="flex w-full h-full items-center justify-center">
      <button
        className={clsx(
          "flex items-center gap-3 w-full transition-all rounded-full",
          { "bg-accent hover:bg-emerald-600": variant === "solid" },
          { "hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary": variant === "normal" },
          { "flex-col justify-center h-12 w-12 aspect-square": !isFull },
          { "flex-row justify-start px-6 h-12": isFull }
        )}
      >
        {icon}
        {isFull && <span>{label}</span>}
      </button>
    </Link>
  );
};

export default HomeLayout;
