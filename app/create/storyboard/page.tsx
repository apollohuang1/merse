import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import { styleSamples } from "@/util/characters";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

type Props = {};

const Storyboard = (props: Props) => {
  return (
    <MaxWidthContainer>
      <div className="flex flex-col w-full h-full justify-between pb-7">
        <CreateHeader
          title="Storyboard"
          description="Add scenes to your story by typing prompts below in the chat bar."
          createRouteConfig={{
            next: {
              title: "Cover",
              pathname: "/create/cover",
            },
            back: {
              title: "Characters",
              pathname: "/create/characters",
            },
          }}
        />

        {/* main content */}
        <div className="flex flex-col w-full h-full max-w-4xl px-7 py-3 overflow-scroll">
          <div className="grid grid-cols-2 max-md:flex max-md:flex-col gap-3 w-full h-full">
            {/* story card */}
            {styleSamples.map((style, index) => (
              <div key={index} className="flex flex-col w-full border border-light-divider dark:border-dark-divider bg-light-background-secondary dark:bg-dark-background-secondary">
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

        {/* chat bar at the bottom */}

        <div className="block px-7">
          <div className="flex flex-row h-12 bg-light-background-secondary dark:bg-dark-background-secondary px-4 rounded-md flex-shrink-0 border border-light-divider dark:border-dark-divider shadow-lg">
            <div className="flex flex-row items-center justify-center h-full w-full">
              <input
                type="text"
                className="w-full h-full text-light-text-primary dark:text-dark-text-primary bg-light-background-secondary dark:bg-dark-background-secondary focus:outline-none placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
                placeholder="Type a message..."
              />

              {/* send button */}
              <button className="flex items-center justify-center w-8 h-8 ml-2 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary active:opacity-70 rounded-md">
                <FiArrowRight className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthContainer>
  );
};

export default Storyboard;
