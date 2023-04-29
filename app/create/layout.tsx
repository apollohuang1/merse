// /create layout

"use client";

import CreateLeftSideBar from "@/components/create/create-left-sidebar";
import Modal from "@/components/modal";
import useAuth from "@/hooks/useAuth";
import { Entry } from "@/models/entry";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setAuthor } from "@/redux-store/store";
import { CreateRoute, createRoutes } from "@/util/create-constants";
import React, { useEffect } from "react";

const metadata = {
  title: {
    name: "Create",
    default: "Next.js App Router",
    template: "%s | Next.js App Router",
  },
  description:
    "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const { reloadCurrentLocalUser } = useAuth();

  const entry = useAppSelector((state) => state.entry);
  const dispatch = useAppDispatch();

  useEffect(() => {
    reloadCurrentLocalUser()
      .then((user: any) => {
        if (user) {
          dispatch(setAuthor(user?._id));
        }
      })
      .catch((err) => {
        // redirect to home/authentication page
        // alert("Please log in to continue");
        // window.location.href = "/";
      });
  }, []);

  return (
    <div className="grid grid-cols-[250px_auto] max-lg:grid-cols-[175px_auto] max-sm:flex max-sm:flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary text-light-text-primary dark:text-dark-text-primary max-h-screen">
      {/* left side bar */}
      <div className="flex max-sm:hidden">
        <CreateLeftSideBar />
      </div>

      {children}
    </div>
  );
}
