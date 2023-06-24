"use client";

import Cover from "@/components/create/cover";
import CreateHeader from "@/components/create/create-header";
import Layout from "@/components/create/layout";
import Review from "@/components/create/review";
import Storyboard from "@/components/create/storyboard";
import StylesRoute from "@/components/create/styles";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  decrementStep,
  incrementStep,
  setContent,
  setEntry,
  setNotificationContent,
} from "@/redux-store/store";
import { CreateRoute } from "@/util/constants/create-constants";
import { createRoutes } from "@/util/constants/create-constants";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {};

const CreateEntryIdPage = (props: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    // fetch entry data
    if (!pathname || !auth.currentUser) return;
    const entryId = pathname.split("/")[2];
    // fetchEntryData(entryId);
  }, [pathname, auth]);

  // const fetchEntryData = async (entryId: string) => {
  //   try {
  //     const response = await axios({
  //       method: "GET",
  //       url: `/api/entries/${entryId}`,
  //       headers: {
  //         Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
  //       },
  //     });

  //     // if (response.data.author._id !== auth?.currentUser) {
  //     //   dispatch(setNotificationContent({
  //     //     title: "Unauthorized",
  //     //     message: "You are not authorized to view this entry.",
  //     //   }))
  //     //   router.push(`/entry/${entryId}`)
  //     //   return
  //     // }

  //     // private to user only
  //     dispatch(setEntry(response.data));
  //     router.push(location.pathname + "/styles");
  //   } catch (error: any) {
  //     console.log("Failed to fetch entry data, message: ", error.message);
  //   }
  // };

  return (
    <div className="grid grid-rows-[64px_auto] overflow-auto">
      {/* <div className="flex flex-cols w-full h-full items-center justify-center"> */}
      {/* <Spinner className="w-6 h-6" /> */}
  
      {/* navigation create header */}
      <div className="flex flex-row w-full sticky top-0 z-20 backdrop-blur-xl dark:backdrop-blur-xl bg-opacity-80 dark:bg-opacity-90 bg-light-background-primary dark:bg-dark-background-primary justify-center px-6 border-none border-light-divider dark:border-dark-divider">
        <div className="flex flex-row justify-between items-center py-4 w-full h-full max-w-3xl">
          <div className="flex flex-col max-w-sm">
            <h1 className="text-2xl font-bold">
              { createRoutes[entryHelper?.currentStep]?.title }
            </h1>
            {/* <p className="text-light-text-secondary font-light">
            {props.currentRoute?.description ?? "Description"}
          </p> */}
          </div>
  
          <div className="flex flex-row gap-4">
            {/* back button */}
            {createRoutes[entryHelper?.currentStep]?.backConfig && (
              <button
                onClick={() => {
                  dispatch(decrementStep());
                }}
                className="group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary"
              >
                <FiChevronLeft className="text-light-text-primary dark:text-dark-text-primary transition-all hover:duration-300" />
                <span>{createRoutes[entryHelper?.currentStep]?.backConfig?.title ?? "Back"}</span>
              </button>
            )}
  
            {createRoutes[entryHelper?.currentStep]?.nextConfig ? (
              <button
                onClick={() => {
                  dispatch(incrementStep());
                }}
                className={clsx(
                  "group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all bg-light-background-secondary dark:bg-dark-background-secondary"
                  // {
                  //   "hover:scale-105 active:scale-100 hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary":
                  //     !props.nextDisabled,
                  // }
                )}
                // disabled={props.nextDisabled}
              >
                <span>{createRoutes[entryHelper?.currentStep]?.nextConfig?.title ?? "Finish"}</span>
                {createRoutes[entryHelper?.currentStep]?.nextConfig && (
                  <FiChevronRight className="text-light-text-primary dark:text-dark-text-primary transition-all hover:duration-300" />
                )}
              </button>
            ) : (
              // review page
              <div className="w-32 h-10 rounded-2xl border border-light-divider dark:border-dark-divider hover:cursor-not-allowed" />
            )}
          </div>
        </div>
      </div>
  
      {entryHelper?.currentStep === 0 && <StylesRoute />}
      {entryHelper?.currentStep === 1 && <Storyboard />}
      {entryHelper?.currentStep === 2 && <Layout />}
      {entryHelper?.currentStep === 3 && <Cover />}
      {entryHelper?.currentStep === 4 && <Review />}
  
    </div>
  );
  
};

export default CreateEntryIdPage;