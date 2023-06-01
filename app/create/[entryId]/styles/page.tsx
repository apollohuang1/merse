"use client";

import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { comicStyles, createRoutes } from "@/util/constants/create-constants";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setStyle, setStylesScrollPosition } from "@/redux-store/store";
import { StyleReference } from "@/models/types";


type Props = {};

const Styles = (props: Props) => {

  // style state
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);

  const dispatch = useAppDispatch();

  const handleStyleSelect = (style: StyleReference) => {
    // dispatch tasks with comic style payload
    if (style.id === entry?.style_reference?.id) {
      dispatch(setStyle(null));
      return;
    }
    dispatch(setStyle(style));
  };

  useEffect(() => {
    // scroll to exact position with element id in format "style-[number]"
    if (entry?.style_reference?.id !== null) {
      document.getElementById(`style-${entry?.style_reference?.id}`)?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, []);

  return (
    <div className="flex flex-col overflow-auto">
      
      {/* top of grid */}
      <CreateHeader currentRoute={createRoutes[0]} nextDisabled={!entry?.style_reference} />

      {/* second section of grid */}
      <div className="flex flex-col w-full h-full justify-start items-center px-6">
        {/* created characters list */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-6 w-full max-w-3xl py-6">
          {comicStyles.map((comicStyle: StyleReference, index: number) => (
            <button
              key={index}
              id={`style-${index}`}
              className={clsx(
                "flex relative aspect-[2/3] hover:scale-[1.04] transition-all hover:z-10 hover:ring-4 hover:ring-accent hover:rounded-lg border border-light-divider dark:border-dark-divider rounded-lg",
                { "ring-2 ring-accent rounded-lg": entry?.style_reference && entry?.style_reference.id == index.toString() },
                { "opacity-30 dark:opacity-50 brightness-[0.7]": entry?.style_reference && entry?.style_reference.id != index.toString() }
              )}
              onClick={() => {
                handleStyleSelect({ ...comicStyle, id: index.toString() })
              }}
            >
              <img
                src={comicStyle?.artwork?.url}
                className={clsx("w-full h-full object-cover rounded-lg")}
              />

              { comicStyle.preset_name &&
                <div className="absolute flex flex-col w-full h-full items-end justify-end p-2">
                  <span className="text-white text-sm px-3 py-1 rounded-full backdrop-blur-xl bg-[rgb(50,50,50,0.8)]">
                    {comicStyle.preset_name}
                  </span>
                </div>
              }

            </button>
          ))}

          {/* <button className="group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70 rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <FiPlus className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Create Style
              </span>
            </div>
          </button> */}
          
        </div>
      </div>
    </div>
  );
};

export default Styles;
