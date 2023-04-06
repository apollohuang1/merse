"use client";

import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import { styleSamples } from "@/util/characters";
import clsx from "clsx";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { createRoutes } from "../layout";
import { ComicStyle, comicStyles } from "@/util/create-samples";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setStyle } from "@/redux-store/store";

type Props = {};

type CartoonStyle = {
  id: string;
  artwork: {
    url: string;
  };
};

const Styles = (props: Props) => {
  // const [selectedStyle, setSelectedStyle] = React.useState<ComicStyle | null>(null);

  // style state
  const selectedStyle = useAppSelector((state) => state.entry.style_reference);
  const dispatch = useAppDispatch();

  const handleStyleSelect = (comicStyle: ComicStyle) => {
    // dispatch tasks with comic style payload
    if (comicStyle.artist === selectedStyle?.artist) {
      dispatch(setStyle(null));
      return;
    }
    dispatch(setStyle(comicStyle));
  };

  return (
    <div className="grid grid-rows-[100px_auto] overflow-x-hidden overflow-y-scroll">
      {/* top of grid */}
      <CreateHeader currentRoute={createRoutes[0]} />

      {/* second section of grid */}
      <div className="flex flex-col w-full h-full justify-center items-center">
        {/* created characters list */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-7 w-full h-full max-w-4xl py-7">
          {comicStyles.map((comicStyle: ComicStyle, index: number) => (
            <button
              key={index}
              className={clsx(
                "flex relative aspect-[2/3] hover:scale-[1.04] transition-all hover:z-10 hover:ring-4 hover:ring-emerald-500 hover:rounded-lg border border-light-divider dark:border-dark-divider rounded-lg",
                {
                  "ring-4 ring-emerald-500 rounded-lg":
                    selectedStyle &&
                    selectedStyle.artist === comicStyle?.artist,
                },
                {
                  "opacity-30 dark:opacity-50 brightness-[0.7]":
                    selectedStyle &&
                    selectedStyle?.artist !== comicStyle?.artist,
                }
              )}
              onClick={() => handleStyleSelect(comicStyle)}
            >
              <img
                src={comicStyle?.artwork?.url}
                className={clsx("w-full h-full object-cover rounded-lg")}
              />

              <div className="absolute flex flex-col w-full h-full items-center justify-end">
                {/* <span className="text-white text-sm font-bold px-2 rounded-full backdrop-blur-xl bg-[rgb(50,50,50,0.8)]"> */}
                {/* {style.artist} */}
                {/* </span> */}
              </div>
            </button>
          ))}

          <button className="group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70 rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <FiPlus className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Create Style
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Styles;
