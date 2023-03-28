import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import { styleSamples } from "@/util/characters";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

type Props = {};

const Storyboard = (props: Props) => {
  return (
    <div className="flex flex-col w-full justify-between">

      {/* main content */}
      <div className="grid grid-cols-2 w-full h-full">
        
        {/* prompt panel */}
        <div className="w-full h-full">
          <textarea
            placeholder="Type a prompt..."
            className="w-full h-full bg-transparent p-7 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
          />
        </div>

        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col max-md:flex max-md:flex-col gap-3 w-full h-full">
            {/* story card */}
            {styleSamples.map((style, index) => (
              <div
                key={index}
                className="flex flex-col w-full border border-light-divider dark:border-dark-divider bg-light-background-secondary dark:bg-dark-background-secondary"
              >
                <img
                  src={style?.artwork?.url}
                  alt="comic book cover"
                  className="object-cover aspect-[4/3]"
                />

                {/* story line in storyboard */}
                <div className="flex p-4">
                  <p className="text-light-text-primary dark:text-dark-text-primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
