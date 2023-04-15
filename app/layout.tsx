"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux-store/store";

// Login Provider
import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const metadata = {
  title: "Merse Comic",
  description:
    "Effortlessly transform journal entries into personalized comics using our intuitive app. Publish, share, and monetize your creations within a supportive community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // const { setCurrentUser } = useAuth();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>

      <body className="bg-light-background-primary dark:bg-dark-background-primary">
      {/* <body className="bg-dark-background-primary"> */}
        <Provider store={store}>
          <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
            <SessionProvider>
              { children }
            </SessionProvider>
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
