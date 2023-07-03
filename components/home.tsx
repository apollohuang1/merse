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
import useColorScheme from "@/hooks/useColorScheme";
import { genres, sampleArtists } from "@/util/constants/home-constant";
import { storyboardSamples } from "@/util/constants/create-constants";
import { useRouter } from "next/navigation";

type Props = {};

const Home = (props: Props) => {
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  const router = useRouter();

  const [currentGenre, setCurrentGenre] = React.useState<string>("All");

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center w-full h-full">
      {/* main content */}
      <div className="flex flex-col w-full h-full gap-0 max-sm:gap-3 items-center">
        {/* artist updates */}
        <div className="flex flex-row gap-5 max-sm:gap-4 overflow-x-auto px-6 w-full py-3">
          {sampleArtists.map((artist, index) => {
            return (
              <button
                key={index}
                className="group flex flex-col items-center gap-2 w-20 min-w-[80px]"
                onClick={() => {
                  if (artist._id || artist.username) {
                    router.push(`/${artist.username || artist._id}`);
                  }
                }}
              >
                <img
                  src={artist?.profile_image_url}
                  className={
                    "w-20 h-20 object-cover aspect-square aspect-square rounded-full border-2 border-emerald-500 p-1 rounded-full group-hover:scale-105 transition-all duration-300 group-active:scale-100"
                  }
                  alt="profile image"
                />

                <span className="line-clamp-1 text-sm">{artist?.name}</span>
              </button>
            );
          })}
        </div>

        {/* categories */}
        <div className="sticky top-[56px] flex flex-row gap-3 max-sm:gap-4 overflow-x-auto px-6 py-3 w-full z-10 bg-light-background-primary dark:bg-dark-background-primary">
          {["All", ...genres].map((genre, index) => (
            <button
              key={index}
              onClick={() => setCurrentGenre(genre)}
              className={clsx(
                "flex flex-row flex-1 flex-shrink-0 items-center border border-light-dividerContrast dark:border-dark-dividerContrast rounded-full py-2 px-3",
                { "bg-emerald-500 text-dark-text-primary" : currentGenre === genre }
              )}
            >
              <span className="text-sm whitespace-nowrap">{genre}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 w-full gap-6 items-center justify-between overflow-auto px-6 py-3">
          {storyboardSamples.map((scene: any, index: number) => {
            return (
              <div
                key={index}
                className="group flex flex-col justify-start h-full"
              >
                <button className="relative aspect-video rounded-lg overflow-clip">
                  <img
                    src={scene?.artwork.url}
                    className="inset-0 w-full h-full object-cover"
                  />

                  {/* overlay */}
                  <div className="absolute flex flex-col items-start justify-end bottom-0 bg-gradient-to-t from-[rgb(0,0,0,0.75)] to-transparent w-full h-1/2 p-4 text-lg" />
                </button>

                <div className="flex flex-row justify-between">
                  <div className="text-left py-2">
                    <span className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
                      Puuung Sample {index + 1}
                    </span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 w-5/6">
                      {scene.text}
                    </span>
                  </div>

                  {/* <div className="flex flex-row flex-shrink-0 gap-2 items-center bg-transparent pl-3 pr-4 py-2 rounded-full">
                    <img
                      src={sampleArtists[1].profile_image_url}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Puuung</span>
                  </div> */}
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
