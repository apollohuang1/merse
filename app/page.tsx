"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import MerseLogo from "@/components/svgs/merse-logo";
import React, { useEffect, useRef } from "react";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiChevronRight,
  FiLogOut,
  FiPause,
  FiPlay,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { HiPlay, HiPause } from "react-icons/hi2";
import Modal from "@/components/modal";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  midjourneyGeneratedImages,
  teamMembers,
} from "@/util/landing-constant";

import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
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

  const homeContents: any[] = [
    {
      sectionTitle: "About",
    },
    {
      sectionTitle: "Storyboard",
    },
    {
      sectionTitle: "Team",
    },
    // {
    //   sectionTitle: "Contact",
    // }
  ];

  const menuItems = [
    {
      icon: <FiUser />,
      label: "Profile",
      onClick: () => {
        console.log("Profile");
      },
    },
    // {
    //   icon: <FiSettings />,
    //   label: "Settings",
    //   onClick: () => {
    //     console.log("Settings");
    //   },
    // },
    {
      icon: <FiLogOut />,
      label: "Logout",
      onClick: () => {
        logOut();
      },
    },
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
            "flex w-full h-navigationBar items-center justify-center fixed top-0 z-10 transition px-6",
            {
              "bg-gradient-to-b from-[rgb(0,0,0,0.7)] to-transparent":
                scrollY < 100,
            },
            { "bg-[rgb(13,13,14,0.7)] backdrop-blur-xl": scrollY >= 100 }
          )}
        >
          <div className="grid grid-cols-3 max-md:flex max-md:flex-row max-md:justify-between items-center text-white py-2 w-full h-navigationBar max-w-5xl">
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
                            "text-neutral-300": scrollY < 100,
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
                <Menu>
                  <MenuButton>
                    <button
                      onClick={() => {
                        // logOut();
                      }}
                      className="flex flex-row gap-3"
                    >
                      <div className="relative w-6 h-6 rounded-full bg-dark-text-secondary overflow-hidden">
                        <svg
                          className="absolute h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>

                        <img
                          src={auth?.currentUser?.profile_image_url}
                          className="absolute w-6 h-6 rounded-full"
                          alt="user profile image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                          }}
                        />
                      </div>

                      {/* <span>{auth?.currentUser?.name ?? "Unknown"}</span> */}
                    </button>
                  </MenuButton>

                  <MenuList className="bg-light-background-primary dark:bg-dark-background-secondary w-48 rounded-lg drop-shadow-2xl border border-light-divider dark:border-dark-divider">
                    {menuItems.map((item, index) => {
                      return (
                        <MenuItem
                          onClick={item.onClick}
                          key={index}
                          className={clsx(
                            "flex flex-row justify-between px-3 h-12 transition-all duration-[275ms]",
                            {
                              "focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider":
                                index !== menuItems.length - 1,
                            },
                            { "rounded-t-lg": index === 0 },
                            {
                              "rounded-b-lg focus:bg-red-500 focus:bg-opacity-30":
                                index === menuItems.length - 1,
                            }
                          )}
                        >
                          <div
                            className={clsx(
                              "flex flex-row gap-3 items-center",
                              {
                                "text-light-red dark:text-dark-red":
                                  item.label === "Logout",
                              },
                              {
                                "text-light-text-primary dark:text-dark-text-primary":
                                  item.label !== "Logout",
                              }
                            )}
                          >
                            {item.icon}
                            <span
                              className={clsx("text-base font-normal", {
                                "text-light-text-primary dark:text-dark-text-primary":
                                  item.label !== "Logout",
                              })}
                            >
                              {item.label}
                            </span>
                          </div>

                          { item.label !== "Logout" &&
                            <FiChevronRight className="text-light-text-secondary dark:text-dark-text-secondary w-[18px] h-[18px]"/>
                          }

                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
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

          <div
            id="section-2"
            // className="relative flex flex-col w-full h-withoutNavigationBar max-lg:h-auto bg-[rgb(13,13,13)] items-center justify-between overflow-hidden pt-[15vh] px-6"
            className="relative flex flex-col w-full h-screen max-lg:h-auto bg-[#F5F5F7] items-center justify-between px-6 min-h-[55vh] gap-[calc(42px+24px)]"
          >
            {/* <div> */}

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
            {/* </div> */}
          </div>

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
            <div className="flex flex-row h-10 gap-3 justify-center items-center px-4 border border-light-divider dark:border-dark-divider rounded-full">
              <Spinner speed={"0.8s"} className="w-4 h-4 text-accent" />
              <span className="text-sm">Logging in...</span>
            </div>
          ) : (
            <button
              onClick={() => {
                continueWithGoogle();
              }}
              className="flex flex-row items-center justify-center gap-2 px-4 h-10 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider"
            >
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          )}

          <p className="text-sm text-dark-text-secondary text-center max-w-sm border-t border-t-light-divider dark:border-t-dark-divider py-6">
            By continuing, you agree to Merse&apos;s{" "}
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
