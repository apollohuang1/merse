"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";

// conpoments
import Landing from "@/components/landing";

// hooks
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux-store/hooks";

const HomePage: React.FC<{}> = () => {
  const { showSplashScreen, logOut } = useAuth();

  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="text-white">
      {/* {!auth?.currentUser ? (
        <></>
      ) : (
        <Landing />
      )} */}
      
      <Landing />

      {/* splash screen */}
      <div
        className={clsx(
          "fixed flex h-screen w-screen bg-black top-0 z-[9999999999] overflow-hidden items-center justify-center",
          { hidden: !showSplashScreen }
        )}
      >
        <img src="/merse-white.png" className="object-contain w-8" alt="merse logo" />
      </div>
    </div>
  );
};

export default HomePage;
