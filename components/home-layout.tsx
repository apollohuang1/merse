import React, { Children } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import { FiChevronsLeft, FiFeather, FiHome, FiMenu, FiMoreHorizontal, FiSearch, FiSidebar } from "react-icons/fi";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // redux
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  const [showFullSidebar, setShowFullSidebar] = React.useState(false);

  const toggleSidebar = () => {
    setShowFullSidebar(!showFullSidebar);
  };

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen">

      <div
        className={clsx(
          "w-full h-full duration-300",
          { "flex flex-col": !auth?.currentUser }, // unauthenticated
          {
            "grid grid-cols-[80px_auto]":
              auth?.currentUser && !showFullSidebar,
          }, // authenticated, hide sidebar
          {
            "grid grid-cols-[250px_auto]":
              auth?.currentUser && showFullSidebar,
          } // authenticated, show sidebar
        )}
      >
        {/* left side bar */}
        {auth?.currentUser && (
          <div className="flex flex-col w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary items-center justify-start border-r border-r-light-divider dark:border-dark-divider">

            {/* sidebar show toggle button */}
            <div
              className={clsx(
                "flex h-navigationBar w-full items-center p-3 duration-300",
                { "justify-end" : showFullSidebar },
                { "justify-center" : !showFullSidebar }
              )}
            >
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className="flex w-10 h-10 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary items-center justify-center rounded-full"
              >
                { showFullSidebar ? (
                  <FiChevronsLeft className="text-light-text-secondary dark:text-dark-text-secondary w-5 h-5" />
                ) : (
                  <FiMenu className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                )}
              </button>
            </div>

            {/* side menus */}

            <div className="flex flex-col w-full p-3 gap-2">
              {/* home */}
              <SidebarMenuButton icon={<FiHome />} label="Home" isFull={showFullSidebar} />

              {/* subscription */}
              <SidebarMenuButton icon={<FiFeather />} label="Subscription" isFull={showFullSidebar} />

              {/* create */}
            </div>

          </div>
        )}

        {children}
      </div>
    </div>
  );
};

const SidebarMenuButton: React.FC<{ icon: React.ReactNode; label: string, isFull: boolean }> = ({
  icon,
  label,
  isFull
}) => {
  return (
    <button className={clsx(
      "flex items-center gap-3 px-6 w-full h-12 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary transition-all rounded-xl",
      { "flex-col justify-center" : !isFull },
      { "flex-row justify-start" : isFull }
    )}>
      { icon }
      { isFull && <span>{ label }</span> }
    </button>
  );
};


export default HomeLayout;
