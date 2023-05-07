"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux-store/store";

// Login Provider
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomeLayout from "@/components/home-layout";

import { loadStripe } from "@stripe/stripe-js";

const metadata = {
  title: "Merse Comic",
  description:
    "Effortlessly transform journal entries into personalized comics using our intuitive app. Publish, share, and monetize your creations within a supportive community.",
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY as string);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const stripeOptions = {
    // passing the client secret obtained from the server
    clientSecret: process.env.STRIPE_SECRET_KEY,
  };

  return (
    <html lang="en">
      <head>
        {/* title */}
        <title>{metadata.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/merse-logo.png" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>

      <body className="bg-light-background-primary dark:bg-dark-background-primary">
        {/* <body className="bg-dark-background-primary"> */}
        <Provider store={store}>
          <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
            {/* <Elements stripe={stripePromise} options={stripeOptions}> */}
            <HomeLayout>{children}</HomeLayout>
            {/* </Elements> */}
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
