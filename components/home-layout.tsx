import React, { Children } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import { FiMoreHorizontal } from "react-icons/fi";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // redux
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen">
      {/* <NavigationBar isAuthenticated={true} /> */}

      <div
        className={clsx(
          "w-full h-full",
          { "flex flex-col": !auth?.currentUser }, // unauthenticated
          { "grid grid-cols-[100px_auto]": auth?.currentUser } // authenticated
        )}
      >

        {/* left side bar */}
        {auth?.currentUser && (
          <div className="flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary justify-between border-r border-r-light-divider dark:border-r-dark-divider">

            <div></div>

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
