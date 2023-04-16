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
          <div className="flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-between border-r border-r-light-divider dark:border-r-dark-divider">
            <div
              className={clsx(
                "flex h-navigationBar w-full items-center p-3",
                { "justify-end duration-300" : showFullSidebar },
                { "justify-center duration-300" : !showFullSidebar }
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

            <button
              onClick={() => {
                toggleColorScheme();
              }}
              className="flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary w-full"
            >
              <span className="text-sm">Dark Mode</span>
              <FiMoreHorizontal className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
