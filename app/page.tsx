"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import MerseLogo from "@/components/svgs/merse-logo";
import React, { useRef } from "react";
import { FiArrowUpRight, FiBookOpen } from "react-icons/fi";
import Modal from "@/components/modal";

import { FcGoogle } from "react-icons/fc";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux-store/hooks";

const inter = Inter({ subsets: ["latin"] });

const Home: React.FC<{}> = () => {

  const auth = useAppSelector((state) => state.auth);

  const { continueWithGoogle } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showLoginModal, setShowLoginModal] = React.useState(false);

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

  const midjourneyGeneratedImages = [
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095187326596034570/markrachapoom_a_boy_a_girl_cat_and_their_puppy_sitting_in_an_ap_8a20e766-3e58-4c77-afbe-fc0502cc4021.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095187227534971053/markrachapoom_a_boy_a_girl_cat_and_their_puppy_sitting_in_an_ap_c3349e20-6a95-4c74-b8b0-33735473d38f.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095188581586313266/markrachapoom_girl_with_long_hair_blue_checkered_pajamas_rollin_42d31631-9e7c-4b01-acfc-76aa15aa1ffb.png?width=1402&height=1402",
    },

    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095188844585951292/markrachapoom_20-year-old_2_girls_and_a_boy_traveling_together__9785f8c0-9044-48ce-b13b-cf7374994da6.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1094607894101643284/markrachapoom_A_peaceful_neighborhood_in_Connecticut_with_snowy_2b9256aa-b661-4b4e-bfcf-38c904d8e7de.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095192962029338674/markrachapoom__Emily_is_walking_in_New_York_City_dduring_Christ_e6d8df6e-5020-4aab-bb8f-338b9403c4b9.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095193054387904542/markrachapoom_Jyoti_is_walking_in_New_York_City_dduring_Christm_a1edac93-fd0e-4404-911e-bbdc47c0cba2.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095189802879561838/markrachapoom_a_boy_a_girl_cat_and_their_puppy_sitting_in_an_ap_3b74d0de-5d5c-429e-a204-7bc4a807acdb.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095187060266107010/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_9cc31a01-d495-4ddd-9013-86365f09805d.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095192279221801010/markrachapoom_mommy_and_cute_little_daughter_baby_are_cooking_t_5ddc4dfd-7cba-4c5b-9093-ed7b07c3d8f9.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095192821994098728/markrachapoom_lights_stage_dancers_rhythm_elegance_chemistry_sp_9b134966-49f9-4550-98de-0e159015b45e.png?width=1402&height=1402",
    },
    {
      image_url:
        "https://media.discordapp.net/attachments/1090027780525273153/1095189720667013191/markrachapoom_These_three_people_with_referenced_faces_are_trav_64e07c6e-0997-4034-8339-6396e1c2c1c5.png?width=1402&height=1402",
    },
  ];

  const teamMembers = [
    {
      name: "Emily Park",
      image_url: "https://media.discordapp.net/attachments/1090027780525273153/1094610033930678272/telegram-peer-photo-size-1-5138860470982257726-1-0-0.jpg?width=1280&height=1280",
      twitter_url: "https://twitter.com/mlaparkk",
    },
    {
      name: "Jyoti Rani",
      image_url: "https://media.discordapp.net/attachments/1090027780525273153/1095208674005368882/Screenshot_2023-04-11_at_11.48.06_AM.png?width=1534&height=1400",
      twitter_url: "https://twitter.com/jyotiinar",
    },
    {
      name: "Mark Rachapoom",
      image_url: "https://media.discordapp.net/attachments/1090027780525273153/1094610034140401674/At1b9Wrr_400x400.png?width=800&height=800",
      twitter_url: "https://twitter.com/markrachapoom",
    },
  ];

  return (
    <>
      <div className="flex flex-col bg-black">
        {/* navigation bar */}
        <div className="grid grid-cols-3 max-md:flex max-md:flex-row max-md:justify-between items-center fixed top-0 text-white py-2 px-10 max-lg:px-7 z-10 backdrop-blur-xl bg-[rgb(13,13,14,0.7)] w-full h-navigationBar">
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
            <div className="flex flex-row bg-dark-background-secondary border border-dark-divider rounded-full">
              {/* capsult tab picker to scroll to three pages below with animation */}
              <div className="flex flex-row">
                {homeContents.map((item: any, index: number) => {
                  return (
                    <button
                      onClick={() => {
                        scrollToSection(index + 1);
                      }}
                      key={index}
                      className={`flex flex-row items-center gap-2 text-neutral-400 hover:text-white font-light px-4 hover:bg-neutral-800 rounded-full transition-all active:opacity-50`}
                    >
                      <span className="text-sm">{item?.sectionTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* login button */}

          { auth.user === null &&
            <div className="flex flex-row items-center justify-end gap-2 h-full">
              <button
                onClick={() => {
                  setShowLoginModal(true);
                }}
                className="flex items-center justify-center text-white bg-accent hover:bg-emerald-600 px-3 rounded-full h-full"
              >
                <span className="text-sm font-medium">Log in</span>
              </button>
            </div>
          }

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
                  <img
                    key={index}
                    src={item.image_url}
                    className="object-cover w-full h-full z-auto"
                  />
                );
              })}
            </div>

            {/* <img
              src="https://images.unsplash.com/photo-1624961149934-efa575e8642e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2391&q=80"
              className="object-cover w-full h-full z-auto"
              alt="home"
            /> */}

            {/* overlay */}
            <div className="absolute bg-black bg-opacity-75 w-full h-full"></div>

            {/* text in the first section */}
            <div className="absolute flex flex-col items-center w-full h-full justify-end gap-5 px-10 py-14">
              <div className="flex flex-col leading-6 items-center text-center">
                <h1 className="text-5xl text-white font-normal line-clamp-3 max-lg:text-3xl max-sm:text-2xl leading-tight">
                  {/* Transform Journals into Comics, Effortlessly */}
                  Journal-to-Comic Made Simple
                </h1>

                <span className="flex text-neutral-300 text-opacity-80 font-light text-lg max-md:text-base max-w-3xl max-md:max-w-xl">
                  Effortlessly transform journal entries into personalized comics
                  using our intuitive app. Publish, share, and monetize your
                  creations within a supportive community.
                </span>
              </div>

              <Link href="/create/styles">
                <button className="inline-flex items-center rounded-full bg-accent bg-opacity-50 backdrop-blur-xl px-4 h-10 text-sm font-medium text-white shadow-sm hover:bg-emerald-600">
                  <span>Create comic book</span>
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
            className="flex flex-col w-full bg-dark-background-primary"
          >
            {/* tema header text */}
            <div className="flex w-full items-center justify-center h-[20vh] max-md:h-[10vh]">
              <span className="text-4xl max-md:text-2xl font-light text-white">Our Team</span>
            </div>

            <div className="flex w-full h-full items-center justify-center pb-36 max-md:pb-14">
              <div className="grid grid-cols-3 max-md:grid-cols-2 w-full gap-6 max-md:gap-3 max-w-5xl px-6 max-md:px-3">
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
                        className="right-0 object-cover w-full h-full aspect-[3/4] rounded-t-lg group-hover:scale-105 transition-all duration-300 z-0 group-active:scale-100"
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
              <p className="text-light-text-secondary dark:text-dark-text-secondary">Turning your journaling entry into comic book</p>
            </div>
          </div>

          {/* continue with google */}
          <button
            onClick={() => {
              continueWithGoogle();
            }}
            className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          <p className="text-sm text-dark-text-secondary text-center max-w-sm border-t border-t-light-divider dark:border-t-dark-divider py-6">
            By continuing, you agree to Merce&apos;s {" "}
            <a className="text-accent font-medium hover:underline cursor-pointer">Terms of Service</a>
            {" "} and acknowledge, you&apos;ve read our {" "}
            <a className="text-accent font-medium hover:underline cursor-pointer">Privacy Policy</a>
          </p>

        </div>
      </Modal>
    </>
  );
};

export default Home;
