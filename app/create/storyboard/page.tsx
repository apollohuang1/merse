import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
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

        {/* chat bar at the bottom */}
        <div className="flex flex-row h-14 bg-light-background-secondary dark:bg-dark-background-secondary px-4 rounded-md">
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
    </MaxWidthContainer>
  );
};

export default Storyboard;
