"use client";

import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import { styleSamples } from "@/util/characters";
import clsx from "clsx";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { createRoutes } from "../layout";

type Props = {};

type CartoonStyle = {
  id: string;
  artwork: {
    url: string;
  };
};

const Styles = (props: Props) => {
  const [selectedStyle, setSelectedStyle] = React.useState<CartoonStyle | null>(
    null
  );

  return (
    <div className="grid grid-rows-[100px_auto] overflow-x-hidden overflow-y-scroll">
      <CreateHeader currentRoute={createRoutes[0]}/>
      <div className="w-full h-full">
        <div className="flex flex-col w-full justify-center items-center">
          {/* created characters list */}
          <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-7 w-full h-full max-w-4xl py-7">
            {styleSamples.map((style: CartoonStyle, i) => (
              <button
                key={i}
                className={clsx(
                  "flex aspect-[2/3] hover:scale-[1.04] transition-all hover:z-10 hover:ring-4 hover:ring-emerald-500 hover:rounded-lg",
                  {
                    "ring-4 ring-emerald-500 rounded-lg":
                      style.id === selectedStyle?.id,
                  },
                  {
                    "opacity-50":
                      style.id !== selectedStyle?.id && selectedStyle !== null,
                  }
                )}
                onClick={() => {
                  if (style.id === selectedStyle?.id) {
                    setSelectedStyle(null);
                    return;
                  }
                  setSelectedStyle(style);
                }}
              >
                <img
                  src={style?.artwork?.url}
                  className={clsx("w-full h-full object-cover rounded-lg")}
                />
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
    </div>
  );
};

export default Styles;
