import React, { Children } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import { FiChevronsLeft, FiMenu, FiMoreHorizontal, FiSearch, FiSidebar } from "react-icons/fi";

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
      {/* <NavigationBar isAuthenticated={true} /> */}

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
          <div className="flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-between border-r border-r-light-divider dark:border-r-dark-divider">
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
                className="flex w-10 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary items-center justify-center rounded-full"
              >
                { showFullSidebar ? (
                  <FiChevronsLeft className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                ) : (
                  <FiMenu className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                )}
              </button>
            </div>

          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
