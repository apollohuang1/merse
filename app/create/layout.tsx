// /create layout

"use client";

import LeftSideBar from "@/components/create/left-side-bar";
import useAuth from "@/hooks/useAuth";
import { Entry } from "@/models/entry";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setUserId } from "@/redux-store/store";
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
  const { reloadCurrentUser } = useAuth();

  const [currentCreateRoute, setCurrentCreateRoute] =
    React.useState<CreateRoute>(createRoutes[0]);
  const [currentCreateRouteIdx, setCurrentCreateRouteIdx] =
    React.useState<number>(0);

  const [savingContent, setSavingContent] = React.useState<Entry | null>(null);

  const entry = useAppSelector((state) => state.entry);
  const dispatch = useAppDispatch();

  useEffect(() => {
    reloadCurrentUser()
      .then((user: any) => {
        console.log("reloadCurrentUser");
        dispatch(setUserId(user?._id));
      })
      .catch((err) => {
        console.log("reloadCurrentUser", err);
        // redirect to home/authentication page
        // alert("Please log in to continue");
        // window.location.href = "/";
      });
  }, []);

  return (
    <html lang="en">
      {/* <html lang="en"> */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata?.description} />
        <title>{metadata?.title?.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>

      <body>
        <div className="grid grid-cols-[250px_auto] max-lg:grid-cols-[175px_auto] max-sm:flex max-sm:flex-col w-screen h-screen bg-light-background-primary dark:bg-dark-background-primary text-light-text-primary dark:text-dark-text-primary max-h-screen">
          {/* left side bar */}
          <div className="flex max-sm:hidden">
            <LeftSideBar />
          </div>

          {/* main container */}
          {children}
        </div>
      </body>
    </html>
  );
}
