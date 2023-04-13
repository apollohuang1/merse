"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import MerseLogo from "@/components/svgs/merse-logo";
import React, { useEffect, useRef } from "react";
import { FiArrowUpRight, FiBookOpen } from "react-icons/fi";
import Modal from "@/components/modal";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  midjourneyGeneratedImages,
  teamMembers,
} from "@/util/landing-constant";

import { useSession, signIn, signOut } from "next-auth/react";
import { Spinner } from "@chakra-ui/react";
import useAuth from "@/hooks/useAuth";
import { setCurrentUser } from "@/redux-store/store";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

const Home: React.FC<{}> = () => {
  const { data: session, status } = useSession();

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    continueWithGoogle,
    showLoginModal,
    setShowLoginModal,
    isLoadingCurrentUser,
    logOut,
  } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const homeContents: any[] = [
    {
      sectionTitle: "About",
    },
    {
      sectionTitle: "Team",
    },
    // {
    //   sectionTitle: "Contact",
    // }
  ];

  const [focusedSectionId, setFocusedSectionId] = React.useState<number>(1);

  const scrollToSection = (sectionNumber: number) => {
    const section = document.getElementById(`section-${sectionNumber}`);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setFocusedSectionId(sectionNumber);
  };

  const [scrollY, setScrollY] = React.useState<number>(0);

  useEffect(() => {
    // log scroll value
    const handleScroll = () => {
      const scrollValue = window.scrollY;
      setScrollY(scrollValue);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col bg-black">
        {/* navigation bar */}

        {/* <div className="flex w-full h-navigationBar items-center justify-center fixed top-0 z-10 bg-[rgb(13,13,14,0.7)] backdrop-blur-xl"> */}
        <div
          className={clsx(
            "flex w-full h-navigationBar items-center justify-center fixed top-0 z-10 transition",
            {
              "bg-gradient-to-b from-[rgb(0,0,0,0.5)] to-transparent":
                scrollY < 100,
            },
            { "bg-[rgb(13,13,14,0.7)] backdrop-blur-xl": scrollY >= 100 }
          )}
        >
          <div className="grid grid-cols-3 max-md:flex max-md:flex-row max-md:justify-between items-center text-white py-2 max-lg:px-7 w-full h-navigationBar max-w-5xl">
            {/* logo and name */}
            <div
              className="flex flex-row items-center gap-2 cursor-pointer active:opacity-75 transition-all"
              onClick={() => {
                // with smooth scroll
                scrollToSection(1);
              }}
            >
              <MerseLogo />
              <span>Comic</span>
            </div>

            {/* section navigator */}
            <div className="flex flex-row w-full justify-center max-md:hidden">
              <div className="flex flex-row">
                {/* capsult tab picker to scroll to three pages below with animation */}
                <div className="flex flex-row">
                  {homeContents.map((item: any, index: number) => {
                    return (
                      <button
                        onClick={() => {
                          scrollToSection(index + 1);
                        }}
                        key={index}
                        className={clsx(
                          `flex flex-row items-center gap-2 hover:text-white font-light px-4 rounded-full transition-all active:opacity-50`,
                          {
                            "text-neutral-300":
                              scrollY < 100,
                          },
                          { "text-neutral-400": scrollY >= 100 }
                        )}
                      >
                        <span className="text-sm">{item?.sectionTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* login button */}

            <div className="flex flex-row items-center justify-end gap-2 h-full">
              {auth?.currentUser ? (
                <button
                  onClick={() => {
                    logOut();
                  }}
                  className="flex flex-row gap-3"
                >
                  <div className="relative w-8 h-8 rounded-full bg-dark-text-secondary overflow-hidden">
                    <svg
                      className="absolute h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>

                    <img
                      src={auth?.currentUser?.profile_image_url}
                      className="absolute w-8 h-8 rounded-full"
                      alt="user profile image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                      }}
                    />
                  </div>

                  {/* <span>{auth?.currentUser?.name ?? "Unknown"}</span> */}
                </button>
              ) : (
                <button
                  onClick={() => {
                    // signIn();
                    setShowLoginModal(true);
                  }}
                  className="flex items-center justify-center text-white bg-accent hover:bg-emerald-600 px-3 rounded-full h-6"
                >
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

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
            <div className="absolute bg-opacity-25 w-full h-full bg-black" />
            <div className="absolute bg-opacity-75 w-full h-full bg-gradient-to-t from-black to-transparent" />

            {/* text in the first section */}
            <div className="absolute flex flex-col items-center w-full h-full justify-end gap-5 px-10 py-28">
              <div className="flex flex-col leading-6 items-center text-center">
                <h1 className="text-5xl text-white font-normal line-clamp-3 max-lg:text-3xl max-sm:text-2xl leading-tight">
                  {/* Transform Journals into Comics, Effortlessly */}
                  Journal-to-Comic Made Simple
                </h1>

                <span className="flex text-neutral-400 text-opacity-80 font-light text-lg max-md:text-base max-w-3xl max-md:max-w-xl">
                  Effortlessly transform journal entries into personalized
                  comics using our intuitive app. Publish, share, and monetize
                  your creations within a supportive community.
                </span>
              </div>

              <Link href="/create/styles">
                <button className="inline-flex items-center rounded-full bg-white hover:bg-opacity-80 backdrop-blur-xl px-4 h-10 text-sm font-medium text-white shadow-sm hover:scale-105 active:scale-100 transition-all">
                  <span className="text-black font-medium">
                    Create comic book
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* <div className="flex w-full h-[30vh] bg-accent">
            <div className="grid grid-cols-3 w-full h-full justify-center items-center gap-7 p-7 max-lg:grid-rows-3">
              { thirdSectionContents.map((item: any, index: number) => {
                return (
                  <div className="flex flex-col w-full h-full items-center justify-center bg-accentSecondary">
                    <span className="text-2xl font-extralight text-white">{item?.title}</span>
                  </div>
                )
              })}
            </div>
          </div> */}

          <div id="section-2" className="flex flex-col w-full bg-black">
            {/* tema header text */}
            <div className="flex w-full items-center justify-center h-[20vh] max-md:h-[10vh]">
              <span className="text-4xl max-md:text-2xl font-light text-white">
                Our Team
              </span>
            </div>

            <div className="flex w-full h-full items-center justify-center pb-36 max-md:pb-14">
              <div className="grid grid-cols-3 max-md:grid-cols-2 w-full gap-6 max-md:gap-3 max-w-5xl px-6 max-md:px-3">
                {teamMembers.map((member, index) => {
                  return (
                    // member detail
                    <Link
                      key={index}
                      className="group flex flex-col bg-dark-background-secondary rounded-none overflow-hidden"
                      href={member?.twitter_url}
                      target="_blank"
                    >
                      <img
                        src={member?.image_url}
                        className="right-0 object-cover w-full h-full aspect-[3/4] rounded-none group-hover:scale-[1.06] transition-all duration-300 z-0 group-active:scale-100 opacity-70 group-hover:opacity-100"
                      />

                      <div className="flex flex-row items-center justify-between p-4 z-10 bg-dark-background-secondary">
                        <span className="text-white text-lg max-md:text-base font-normal line-clamp-1">
                          {member?.name}
                        </span>
                        <FiArrowUpRight className="text-white text-xl font-semibold max-md:text-base ml-2 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
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

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <div className="flex flex-col items-center justify-start w-full h-full text-light-text-primary dark:text-dark-text-primary gap-8 p-6">
          <div className="flex flex-col items-center gap-2">
            <FiBookOpen className="w-10 h-10" />

            <div>
              <h1 className="font-normal">Welcome to Comic</h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Turning your journaling entry into comic book
              </p>
            </div>
          </div>

          {/* continue with google */}
          {isLoadingCurrentUser ? (
            <div className="h-10">
              <Spinner speed={"0.8s"} className="w-4 h-4" />
            </div>
          ) : (
            <button
              onClick={() => {
                continueWithGoogle();
              }}
              className="flex flex-row items-center justify-center gap-2 px-4 h-10 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
            >
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          )}

          <p className="text-sm text-dark-text-secondary text-center max-w-sm border-t border-t-light-divider dark:border-t-dark-divider py-6">
            By continuing, you agree to Merce&apos;s{" "}
            <a className="text-accent font-medium hover:underline cursor-pointer">
              Terms of Service
            </a>{" "}
            and acknowledge, you&apos;ve read our{" "}
            <a className="text-accent font-medium hover:underline cursor-pointer">
              Privacy Policy
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Home;
