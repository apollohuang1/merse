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

type Props = {};

const Home = (props: Props) => {
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center">
      <div className="grid grid-cols-3 h-navigationBar w-full px-6 items-center">
        <div className="flex flex-row gap-3 items-center">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary">
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* search bar */}
        <div className="group flex flex-row gap-3 px-4 items-center w-full h-8 border border-light-divider dark:border-dark-divider rounded-full bg-light-background-secondary dark:bg-dark-background-secondary focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
          <FiSearch className="text-light-text-secondary dark:text-dark-text-secondary group-focus-within:text-accent" />
          <input
            type="text"
            placeholder="Enter the work, artist, or genre"
            className="w-full bg-transparent outline-none placeholder:text-light-text-tertiary placeholder:dark:text-dark-text-tertiary"
          />
        </div>

        <div className="flex flex-row w-full h-8 justify-end items-center">
          <div className="flex flex-row gap-3 items-center justify-center">

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
              <button className="flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default Home;
