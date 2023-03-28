"use client";

import CreateHeader from "@/components/create/create-header";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { createRoutes } from "../layout";

type Props = {};

const storyboardSamples = [
  { artwork: { url: "https://mymodernmet.com/wp/wp-content/uploads/2017/03/puuung-love-is-1.jpg" }},
  { artwork: { url: "https://images.squarespace-cdn.com/content/v1/54fc8146e4b02a22841f4df7/1624708748070-A25VMWA19RLIW3MUQ94L/cover2.jpeg" }},
  { artwork: { url: "https://i.pinimg.com/736x/40/b5/ff/40b5ff11e9226543c9287ffde1bba69f.jpg" }},
  { artwork: { url: "https://i.ytimg.com/vi/d5VBJhlbtnk/maxresdefault.jpg" }},
  { artwork: { url: "https://static.boredpanda.com/blog/wp-content/uploads/2016/06/love-is-illustrations-korea-puuung-98-574fed60683c4__880.jpg" }},
  { artwork: { url: "https://e1.pxfuel.com/desktop-wallpaper/522/148/desktop-wallpaper-puuung-on-instagram-coffee-time-1%EF%B8%8F%E2%83%A3-an-art-print-greeting-card-and-post-card-are-available-on-redbubble-puuung1-redbub%E2%80%A6-puuung.jpg" }},
  { artwork: { url: "https://ninisencoree.files.wordpress.com/2020/04/kakaotalk_20200411_174604120.jpg" }},
  { artwork: { url: "https://i.ytimg.com/vi/3MGC6olB1F4/maxresdefault.jpg" }},
  { artwork: { url: "https://i.ytimg.com/vi/HBWC9wTk4tQ/maxresdefault.jpg" }},
  { artwork: { url: "https://i.ytimg.com/vi/FrjPOH8EHyk/maxresdefault.jpg" }}
]

const Storyboard = (props: Props) => {
  return (
    <div className="grid grid-rows-[100px_auto] overflow-auto">

      {/* top of grid */}
      <CreateHeader currentRoute={createRoutes[2]} />

      {/* main content */}
      <div className="grid grid-cols-2 w-full h-[calc(100vh-100px)] p-7 gap-4">
        
        {/* prompt left panel */}
        <div className="w-full h-full overflow-hidden bg-light-background-secondary dark:bg-dark-background-secondary p-7 rounded-lg">
          <textarea
            placeholder="Type a full journaling prompt..."
            className="w-full h-full bg-transparent placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-none resize-none"
          />
        </div>

        {/* storyboard list right panel */}
        <div className="flex flex-col w-full h-full overflow-auto rounded-lg">
          <div className="flex flex-col max-md:flex max-md:flex-col w-full h-full gap-4">
            {/* story card */}
            {storyboardSamples.map((style, index) => (
              <div
                key={index}
                className="group relative flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary rounded-lg border border-light-divider dark:border-dark-divider"
              >

                {/* overlay  */}
                <div className="flex absolute w-full h-full items-center justify-center aspect-squar bg-black bg-opacity-30 dark:bg-opacity-30 opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-all rounded-lg cursor-pointer">
                  <FiEdit2 className="w-9 h-9 text-white" />
                </div>

                <img
                  src={style?.artwork?.url}
                  alt="comic book cover"
                  className="object-cover aspect-[4/3] rounded-t-lg"
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
