"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import CreateHeader from "@/components/create/create-header";
import { createRoutes } from "@/util/constants/create-constants";
import { FiLock, FiUnlock } from "react-icons/fi";
import { Switch } from "@headlessui/react";
import { toggleIsPrivate } from "@/redux-store/store";
import clsx from "clsx";

type Props = {};
//const { base_64, createImageFromText } = useCreateEntry();

// const base64Image = 'data:image/png;base64,' + base_64

const Review = (props: Props) => {
  //const { base_64 } = useCreateEntry();

  // redux states
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);

  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col w-full justify-start items-center overflow-auto px-6 pt-6">
      {/* main content */}
      <div className="flex flex-col gap-7 w-full h-full max-w-3xl">

        <div className="flex flex-row w-full justify-between py-6 border-b border-light-dividerContrast dark:border-dark-dividerContrast">

          <div className="flex flex-row gap-3">
            {entry?.is_private ? (
              <FiLock className="w-6 h-6" />
            ) : (
              <FiUnlock className="w-6 h-6" />
            )}

            <span>Private Entry</span>
          </div>

          {/* toggle */}
          <Switch
            checked={entry?.is_private}
            onChange={() => {
              dispatch(toggleIsPrivate());
            }}
            className={clsx(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              { "bg-accent": entry?.is_private },
              { "bg-light-background-tertiary dark:bg-dark-background-tertiary": !entry?.is_private }
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                { "translate-x-5": entry?.is_private },
                { "translate-x-0": !entry?.is_private }
              )}
            />
          </Switch>
        </div>

        {/* 3 circle with character images */}
        <div className="flex flex-col gap-6">
          <span className="text-light-text-primary dark:text-dark-text-primary font-bold text-xl">
            Characters
          </span>
          <div className="flex flex-row gap-4">
            {[1, 2, 3].map((i) => (
              // circle image object-cover
              <div
                key={i}
                className="w-32 h-32 bg-light-background-secondary dark:bg-dark-background-secondary rounded-full"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCdoBj4sMKAneZ35yzHHceTTZWXaQly7e46eVsJ1oGD29RKEz71w6KG7jyvXw47uDMnQ&usqp=CAU"
                  alt="character image"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ))}
          </div>
        </div>

        {entry?.canvas && (
            <img
              src={entry?.canvas}
              alt="canvas"
              className="w-full object-contain"
            />
        )}

        {/* <div className="flex flex-col w-full gap-7">
          {JSON.stringify(entry, null, 2)}
          <br />
          <br />
          {JSON.stringify(entryHelper, null, 2)}
        </div> */}
        
      </div>
    </div>
  );
};

export default Review;
