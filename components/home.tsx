import React from "react";
import NavigationBar from "./navigation-bar";
import Head from "next/head";
import { useAppSelector } from "@/redux-store/hooks";
import ProfileMenu from "./wrapper/profile-menu";
import clsx from "clsx";
import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import MerseLogo from "./svgs/merse-logo";
import useColorScheme from "@/hooks/useColorScheme"
import { sampleArtists } from "@/util/home-constant";
import { storyboardSamples } from "@/util/create-constants";
import { useRouter } from "next/navigation";

type Props = {};

const Home = (props: Props) => {
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  const router = useRouter();

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center w-full h-full">

      {/* main content */}
      <div className="flex flex-col w-full h-full gap-6 max-sm:gap-3 items-center">
        {/* promoted banner */}
        <div className="flex relative w-full h-[60vh] overflow-clip">
          <img
            // src="https://static.techspot.com/images2/news/bigimage/2020/02/2020-02-12-image-5.jpg"
            src={"https://media2.giphy.com/media/l1KVaDmsxFkSfSOSA/giphy.gif?cid=ecf05e473fqbn80ec6al5d6ke8462qs8pgqrmzwv153jlf5k&rid=giphy.gif&ct=g"}
            className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.6)]"
          />

          {/* <video
            autoPlay
            loop
            muted
            playsInline
            // ref={demoVideoRef}
            src="./puuung.mp4"
            // poster="./screenshot-storyboard.png"
            className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.6)]"
          /> */}

          {/* artist updates */}
          <div className="absolute flex flex-row gap-5 max-sm:gap-4 overflow-x-auto p-6 w-full bg-gradient-to-b from-[rgb(0,0,0,0.7)] to-transparent">
            {sampleArtists.map((artist, index) => {
              return (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 w-20 min-w-[80px]"
                  onClick={() => {
                    if (artist._id) {
                      router.push(`/${artist._id}`);
                    }
                  }}
                >
                  <img
                    src={artist?.profile_image_url}
                    className={
                      "w-20 h-20 object-cover aspect-square aspect-square rounded-full border-2 border-emerald-500 p-1 rounded-full"
                    }
                    alt="profile image"
                  />

                  <span className="line-clamp-1 text-sm text-white">
                    {artist?.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex absolute bottom-0 h-1/2 bg-gradient-to-t from-[rgb(0,0,0,0.6)] to-transparent w-full items-end justify-end p-6">
            <div className="flex flex-row gap-2 items-center bg-transparent pl-3 pr-4 py-2 rounded-full">
              <img
                src={"https://cdn.myanimelist.net/images/company/21.png"}
                className="w-6 h-6 object-cover rounded-full border border-light-divider dark:border-dark-divider"
              />
              <span className="text-white">Spirited Away</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full gap-6 max-sm:gap-3 items-center justify-between overflow-auto max-sm:px-3 px-6">
          {storyboardSamples.map((artist, index) => {
            return (
              <div key={index}>
                <button className="relative aspect-video min-w-[18vw] h-[24vh] max-lg:min-w-[15vw] max-lg:h-[20vh] max-md:min-w-[12vw] max-md:h-[16vh] rounded-lg overflow-clip">
                  <img
                    src={artist?.artwork.url}
                    className="inset-0 w-full h-full object-cover"
                  />

                  {/* overlay */}
                  <div className="absolute flex flex-col items-start justify-end bottom-0 bg-gradient-to-t from-[rgb(0,0,0,0.75)] to-transparent w-full h-1/2 p-4 text-lg" />
                </button>

                <div className="flex flex-row justify-between">
                  <div className="text-left py-2">
                    <span className="text-light-text-primary dark:text-dark-text-primary text-xl font-bold">
                      Episode {index + 1}
                    </span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 w-5/6">
                      {artist.description}
                    </span>
                  </div>

                  <div className="flex flex-row flex-shrink-0 gap-2 items-center bg-transparent pl-3 pr-4 py-2 rounded-full">
                    <img
                      src={sampleArtists[1].profile_image_url}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white">Puuung</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-[50vh]"></div>
      </div>
    </div>
  );
};

export default Home;
