"use client";

import { Inter } from "next/font/google";
import React, { useEffect, useRef } from "react";

import clsx from "clsx";
import Landing from "@/components/landing";
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux-store/hooks";

const Home: React.FC<{}> = () => {
  const { showSplashScreen, logOut } = useAuth();

  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="text-white">
      
      <Landing />
      {/* {auth?.currentUser ? (
        <button
          className="fixed top-0 ri ght-0 bg-emerald-500 p-4"
          onClick={() => {
            logOut();
          }}
        >
          <span className="text-white">Logout</span>
        </button>
      ) : (
        <Landing />
      )} */}

      {/* splash screen */}
      <div
        className={clsx(
          "fixed flex h-screen w-screen bg-black top-0 z-[9999999999] overflow-hidden items-center justify-center",
          { hidden: !showSplashScreen }
        )}
      >
        <img src="/merse-white.png" className="object-contain w-8" />
      </div>
    </div>
  );
};

export default Home;
