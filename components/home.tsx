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
import { sampleArtists } from "@/util/home-constant";

type Props = {};

const Home = (props: Props) => {
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center w-full h-full">

      {/* top navigation bar */}
      <div className="flex flex-row w-full px-6 py-3 items-center justify-between sticky top-0 bg-light-background-primary dark:bg-dark-background-primary">
        {/* arrow left and right */}
        <div className="flex flex-row gap-3 items-center">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary">
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-row gap-3 items-center justify-center">
          {/* search bar */}
          <div className="group flex flex-row gap-3 px-4 items-center w-80 h-8 border border-light-divider dark:border-dark-divider rounded-full bg-light-background-secondary dark:bg-dark-background-secondary focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <FiSearch className="text-light-text-secondary dark:text-dark-text-secondary group-focus-within:text-accent" />
            <input
              type="text"
              placeholder="Enter the work, artist, or genre"
              className="w-full bg-transparent outline-none placeholder:text-light-text-tertiary placeholder:dark:text-dark-text-tertiary"
            />
          </div>

          <button
            onClick={() => {
              toggleColorScheme();
            }}
            className="flex flex-row gap-2 text-light-text-primary dark:text-dark-text-primary w-8 h-8 items-center justify-center rounded-full hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
          >
            <FiSun className="w-5 h-5" />
          </button>

          {/* <FiBell /> */}
          <ProfileMenu>
            <button className="flex items-center justify-center aspect-square">
              <img
                src={auth?.currentUser?.profile_image_url}
                className={"h-8 w-8 aspect-square rounded-full"}
                alt="user profile image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                }}
              />
            </button>
          </ProfileMenu>
        </div>
      </div>

      {/* main content */}
      <div className="flex flex-col w-full h-full p-6 gap-6 items-center">

        <div className="flex flex-row gap-5 overflow-x-auto py-3 w-full max-w-6xl">
          {sampleArtists.map((artist, index) => {
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-2 w-20 min-w-[80px]"
              >
                <img
                  src={artist?.profile_image_url}
                  className={
                    "w-20 h-20 object-cover aspect-square aspect-square rounded-full border-2 border-emerald-500 p-1 rounded-full"
                  }
                  alt="profile image"
                />

                <span className="line-clamp-1 text-sm">{artist?.name}</span>
              </button>
            );
          })}
        </div>

        {/* <div className="rounded-xl aspect-video overflow-clip"> */}
        {/* <img
          src="https://static.techspot.com/images2/news/bigimage/2020/02/2020-02-12-image-5.jpg"
          className="w-full h-96 object-cover rounded-xl shadow-[4px_24px_60px_rgb(0,0,0,0.6)]"
        /> */}
        {/* </div> */}


        {/* promoted banner */}
        <div className="flex relative w-full h-[480px] overflow-clip rounded-xl max-w-6xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            // ref={demoVideoRef}
            src="./puuung.mp4"
            // poster="./screenshot-storyboard.png"
            className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.6)]"
          />

          <div className="flex absolute bottom-0 h-1/2 bg-gradient-to-t from-[rgb(0,0,0,0.55)] to-transparent w-full items-end p-6">

            <div className="flex flex-row gap-2 items-center backdrop-blur-xl bg-[rgb(0,0,0,0.3)] pl-3 pr-4 py-2 rounded-full">
              <img
                src={sampleArtists[1].profile_image_url}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-white">Puuung</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
