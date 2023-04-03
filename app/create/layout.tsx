// /create layout

"use client";

import CreateHeader from "@/components/create/create-header";
import LeftSideBar from "@/components/create/left-side-bar";
import { IEntry } from "@/server/models/Entry";
import React from "react";

const metadata = {
  title: {
    name: "Create",
    default: "Next.js App Router",
    template: "%s | Next.js App Router",
  },
  description:
    "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
};

export type CreateRoute = {
  pathname: string;
  title: string;
  description: string;
  nextConfig?: CreateRoute | null;
  backConfig?: CreateRoute | null;
};

export const allCreateRoutes: CreateRoute[] = [
  // character, storyboard, cover, styles, review.
  {
    pathname: "/create/styles",
    title: "Styles",
    description: "Add styles to your story.",
  },
  {
    pathname: "/create/characters",
    title: "Characters",
    description: "Add characters to your story.",
  },
  {
    pathname: "/create/storyboard",
    title: "Storyboard",
    description: "Add storyboard to your story.",
  },
  {
    pathname: "/create/cover",
    title: "Cover",
    description: "Add cover to your story.",
  },
  {
    pathname: "/create/review",
    title: "Review",
    description: "Review your story.",
  },
];

// create all routes with back config and next config
export const createRoutes: CreateRoute[] = allCreateRoutes.map((route, i) => {
  const nextRoute = allCreateRoutes[i + 1] || null;
  const backRoute = allCreateRoutes[i - 1] || null;
  return {
    ...route,
    nextConfig: nextRoute,
    backConfig: backRoute,
  };
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentCreateRoute, setCurrentCreateRoute] =
    React.useState<CreateRoute>(createRoutes[0]);
  const [currentCreateRouteIdx, setCurrentCreateRouteIdx] =
    React.useState<number>(0);

  const [savingContent, setSavingContent] = React.useState<IEntry | null>(null);

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
        <div className="grid grid-cols-[250px_auto] max-lg:grid-cols-[175px_auto] max-sm:flex max-sm:flex-col w-screen h-screen bg-light-background-primary dark:bg-dark-background-primary text-light-text-primary dark:text-dark-text-primary">
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
