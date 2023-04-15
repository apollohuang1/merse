import React, { useRef } from "react";

import { FiArrowUpRight, FiChevronRight } from "react-icons/fi";

import {
  midjourneyGeneratedImages,
  teamMembers,
} from "@/util/landing-constant";
import Link from "next/link";
import { HiPause, HiPlay } from "react-icons/hi2";
import NavigationBar from "./navigation-bar";

type Props = {};

const Landing = (props: Props) => {
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const [isDemoVidePlaying, setIsDemoVideoPlaying] =
    React.useState<boolean>(true);

  const toggleVideoPlayState = () => {
    if (demoVideoRef.current) {
      if (demoVideoRef.current.paused) {
        demoVideoRef.current.play();
      } else {
        demoVideoRef.current.pause();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col bg-black">
        {/* navigation bar */}

        <NavigationBar isAuthenticated={false} />

        {/* main content */}
        <div className="flex flex-col gap-0">
          {/* Hero */}
          <div
            id="section-1"
            className="flex relative items-center justify-center h-screen w-screen"
          >
            <div className="grid grid-cols-4 grid-rows-3 max-md:grid-cols-3 max-md:grid-rows-4 h-full">
              {midjourneyGeneratedImages.map((item, index) => {
                return (
                  <div key={index} className="overflow-hidden w-full h-full">
                    <img
                      src={item.image_url}
                      className="object-cover w-full h-full z-auto scale-110"
                    />
                  </div>
                );
              })}
            </div>

            {/* overlay */}
            <div className="absolute bg-opacity-[0.03] w-full h-full bg-gradient-to-tl from-[#FF9F0A30] to-transparent" />
            <div className="absolute bg-opacity-30 w-full h-full bg-black" />
            <div className="absolute bg-opacity-75 w-full h-full bg-gradient-to-t from-[rgb(13,13,13)] to-transparent" />

            {/* text in the first section */}
            <div className="absolute flex flex-col items-center w-full h-full justify-end gap-6 px-6 py-28">
              <div className="flex flex-col leading-6 items-center text-center">
                <h1 className="text-5xl text-white font-normal line-clamp-3 max-md::text-4xl max-sm:text-3xl leading-tight">
                  {/* Transform Journals into Comics, Effortlessly */}
                  Journaling-to-Comic Made Simple
                </h1>

                <span className="flex text-neutral-400 text-opacity-80 font-light text-lg max-md:text-base max-w-3xl max-md:max-w-xl">
                  Effortlessly transform journal entries into personalized
                  comics using our intuitive app. Publish, share, and monetize
                  your creations within a supportive community.
                </span>
              </div>

              <Link href="/create/styles">
                <button className="flex flex-row items-center gap-1 rounded-full bg-white hover:bg-opacity-80 backdrop-blur-xl px-4 h-10 text-sm font-medium text-light-text-primary shadow-sm hover:scale-105 active:scale-100 transition-all">
                  <span className=" font-medium">Create comic book</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          <div
            id="section-2"
            className="relative flex flex-col w-full h-screen max-lg:h-auto bg-[#F5F5F7] items-center justify-between px-6 min-h-[55vh] gap-[calc(42px+24px)]"
          >


            <div className="flex flex-col text-center items-center pt-[calc(42px+24px)]">
              <h1 className="text-5xl text-light-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl">
                {/* Storyboard */}
                Jot. Generate. Publish.
              </h1>
              <span className="flex text-light-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                {/* Jot. Generate. Publish. */}
                create a daily entry
              </span>
            </div>

            <div className="relative max-w-5xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                ref={demoVideoRef}
                src="./landing-demo.mp4"
                poster="./screenshot-storyboard.png"
                className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.7)] bg-dark-background-primary rounded-t-2xl"
                onPlay={() => {
                  setIsDemoVideoPlaying(true);
                }}
                onPause={() => {
                  setIsDemoVideoPlaying(false);
                }}
              />

              {/* play/pause button row with gradient overlay */}
              <div className="absolute bottom-0 right-0 flex flex-row w-full justify-end gap-2 px-4 pb-4 pt-6 bg-gradient-to-t from-[rgb(0,0,0,0.7)] to-transparent">
                <button
                  onClick={() => {
                    toggleVideoPlayState();
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-400 text-white hover:scale-105 active:scale-100 transition-all"
                >
                  {isDemoVidePlaying ? (
                    <HiPause />
                  ) : (
                    <div className="pl-[2px]">
                      <HiPlay />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>


          {/* team section */}
          <div
            id="section-3"
            className="flex flex-col w-full bg-[rgb(13,13,15)] max-lg:h-auto items-center justify-start gap-[calc(42px+24px)] py-[calc(42px+24px)] px-6"
          >
            {/* team header text */}
            <div className="flex flex-col text-center items-center">
              <h1 className="text-5xl text-dark-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl">
                Our Team
              </h1>
              <span className="flex text-light-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                Meet the incredible people behind the scenes :)
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 max-md:grid-cols-2 w-full gap-6 max-w-5xl max-sm:gap-4">
                {teamMembers.map((member, index) => {
                  return (
                    // member detail
                    <Link
                      key={index}
                      className="group flex flex-col bg-dark-background-secondary rounded-lg overflow-hidden"
                      href={member?.twitter_url}
                      target="_blank"
                    >
                      <img
                        src={member?.image_url}
                        className="object-cover w-full h-full group-hover:scale-[1.06] transition-all duration-300 z-0 group-active:scale-100 opacity-70 group-hover:opacity-100"
                      />

                      <div className="flex flex-row items-center justify-between p-4 z-10 bg-dark-background-secondary">
                        <span className="text-white text-lg max-md:text-base max-sm:text-sm font-normal line-clamp-1">
                          {member?.name}
                        </span>
                        <FiArrowUpRight className="text-white text-xl font-semibold max-md:text-base ml-2 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 max-sm:hidden" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* <div
              id="section-3"
              className="flex flex-row h-[50vh] items-end justify-center p-10 max-lg:p-7 max-md:h-[50vh]"
            >
              <div className="flex flex-row gap-6 text-neutral-400">
                <a
                  href={"https://www.instagram.com/mersecompany"}
                  target={"_blank"}
                  className={"hover:text-white transition-all active:opacity-50"}
                >
                  Instagram
                </a>

                <a
                  href={"https://www.twitter.com/mersecompany"}
                  target={"_blank"}
                  className={" hover:text-white transition-all active:opacity-50"}
                >
                  Twitter
                </a>
              </div>
            </div> */}
        </div>
      </div>
    </>
  );
};

export default Landing;
