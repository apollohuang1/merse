import React, { useRef } from "react";

import {
  FiArrowLeft,
  FiArrowUpRight,
  FiBookOpen,
  FiChevronRight,
} from "react-icons/fi";

import {
  midjourneyGeneratedImages,
  teamMembers,
} from "@/util/constants/landing-constant";
import Link from "next/link";
import { HiPause, HiPlay } from "react-icons/hi2";
import NavigationBar from "./navigation-bar";
import { FcGoogle } from "react-icons/fc";
import Modal from "./modal";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@chakra-ui/react";

// Tweets
import {
  markQuoteRyanTweetHtml,
  ryanTweetHtml,
  tweets,
} from "@/util/constants/home-constant";
import parse from "html-react-parser";
import { Transition } from "@headlessui/react";

type Props = {};

const Landing = (props: Props) => {
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const [isDemoVidePlaying, setIsDemoVideoPlaying] =
    React.useState<boolean>(true);

  const {
    showLoginModal,
    setShowLoginModal,
    isLoadingCurrentUser,
    continueWithGoogle,
    googleUserDataTemp,
    setGoogleUserDataTemp,
    registeringUserData,
    setRegisteringUserData,
    registerNewUser,
  } = useAuth();

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

        <NavigationBar
          isAuthenticated={false}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />

        {/* main content */}
        <div className="flex flex-col gap-0">
          {/* Hero */}
          <div
            id="about"
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

              {/* <div className="flex flex-row max-w-xl w-full h-12 rounded-full border border-white border-opacity-20 backdrop-blur-2xl bg-white bg-opacity-10 px-5">

                <input
                  type="text"
                  placeholder="Enter your email"
                  className="flex w-full bg-transparent text-white placeholder-white placeholder-opacity-50 outline-none"
                />

                <button className="flex flex-shrink-0 flex-row items-center justify-center px-3 h-full rounded-full">
                  Join Waitlist
                </button>
              </div> */}

              <button
                className="flex flex-row items-center gap-1 rounded-full bg-white hover:bg-opacity-80 backdrop-blur-xl px-4 h-10 text-sm font-medium text-light-text-primary shadow-sm hover:scale-105 active:scale-100 transition-all"
                onClick={() => {
                  setShowLoginModal(true);
                }}
              >
                <span className=" font-medium">Browse the app</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            id="storyboard"
            className="relative flex flex-col w-full h-auto max-lg:h-auto bg-[#F5F5F7] items-center justify-between px-6 gap-[calc(42px+24px)]"
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
                  className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-full border border-neutral-400 text-white hover:scale-105 active:scale-100 transition-all"
                >
                  {isDemoVidePlaying ? (
                    <HiPause className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                  ) : (
                    <HiPlay className="w-5 h-5 max-sm:w-4 max-sm:h-4 pl-[2px]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            id="wall-of-love"
            // className="flex flex-col items-center justify-center max-lg:px-7 h-screen max-lg:h-auto gap-[calc(42px+24px)] py-[calc(42px+24px)]"
            className="flex flex-col w-full max-lg:h-auto items-center justify-start gap-[calc(42px+24px)] py-[calc(42px+24px)] px-6"
          >
            {/* team header text */}
            <div className="flex flex-col text-center items-center">
              <h1 className="text-5xl text-dark-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl">
                Wall of Love
              </h1>
              <span className="flex text-light-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                {/* Wall of Love */}
                Tweet from Ryan Hoover, and Airchat from Naval Ravikant
              </span>
            </div>

            <div className="flex flex-row items-center gap-8 max-lg:flex-col max-lg:items-center max-w-screen max-lg:w-full justify-center max-lg:gap-16">
              {/* ryan tweets container */}
              <div className="flex flex-col max-sm:w-[calc(100vw-(28*2)px)] max-lg:w-full items-start max-lg:items-center">
                {parse(ryanTweetHtml)}
                {parse(markQuoteRyanTweetHtml)}
                <button
                  onClick={() => {
                    // target blank open ryanhover twitter profile
                    window.open("https://twitter.com/rrhoover", "_blank");
                  }}
                  className="flex flex-row px-6 py-2 gap-1 items-center justify-center rounded-full border border-dark-dividerContrast hover:bg-dark-background-secondary"
                >
                  <span className=" max-sm:text-sm">
                    Ryan Hoover, Founder of Product Hunt
                  </span>
                  <FiChevronRight className="text-accent font-medium" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <iframe
                  src="https://www.getairchat.com/sigil/sideprojects/afcfab29-9896-4ba0-b547-52d8d6b8197d"
                  title="Naval's Reponse"
                  className="aspect-[9/16] rounded-xl"
                />
                <button
                  onClick={() => {
                    // target blank open ryanhover twitter profile
                    window.open("https://twitter.com/naval", "_blank");
                  }}
                  className="flex flex-row px-6 py-2 gap-1 items-center justify-center rounded-full border border-dark-dividerContrast hover:bg-dark-background-secondary"
                >
                  <span className=" max-sm:text-sm">
                    Naval Ravikant, Founder of AngelList
                  </span>
                  <FiChevronRight className="text-accent font-medium" />
                </button>
              </div>
            </div>
          </div>

          {/* team section */}
          <div
            id="team"
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

                      <div className="flex flex-row items-center justify-between max-sm:justify-center p-4 z-10 bg-dark-background-secondary">
                        <span className="text-white text-lg max-md:text-base font-normal line-clamp-1">
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
        withPaddingTop={false}
      >
        {!googleUserDataTemp ? (
          <div className="flex flex-col items-center justify-start w-full h-80 text-light-text-primary dark:text-dark-text-primary gap-8 p-6 transition-all ease-in-out duration-300">
            {/* step 1 */}
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
              <div className="flex flex-shrink-0 flex-row h-10 gap-3 justify-center items-center px-4 border border-light-divider dark:border-dark-divider rounded-full">
                <Spinner speed={"0.8s"} className="w-4 h-4 text-accent" />
                <span className="text-sm">Logging in...</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  continueWithGoogle();
                }}
                className="flex flex-row flex-shrink-0 items-center justify-center gap-2 px-4 h-10 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider"
              >
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </button>
            )}

            {/* <div className="flex flex-col p-3 items-center justify-center border border-accent bg-emerald-500 bg-opacity-10 rounded-xl">
                    <p className="text-sm">
                      <br/>
                    </p>
                  </div> */}

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
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-[704px] max-w text-light-text-primary dark:text-dark-text-primary gap-8 p-6 transition-all ease-in-out duration-300">
            {/* step 2 */}

            <div className="flex flex-row gap-3 w-full items-center">
              <button
                onClick={() => {
                  setGoogleUserDataTemp(null);
                }}
                className="p-2 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary"
              >
                <FiArrowLeft className="text-light-text-secondary dark:text-dark-text-secondary" />
              </button>

              <span>{googleUserDataTemp?.email}</span>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {/* banner */}
              <div className="flex flex-col">
                {registeringUserData?.banner_image_url ? (
                  <img
                    src={registeringUserData?.banner_image_url ?? ""}
                    alt="banner"
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 bg-light-background-secondary dark:bg-dark-background-secondary" />
                )}

                {registeringUserData?.profile_image_url ? (
                  <img
                    src={registeringUserData?.profile_image_url ?? ""}
                    alt="profile"
                    className="w-20 h-20 rounded-full -mt-10 mx-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full -mt-10 mx-3 bg-light-background-secondary dark:bg-dark-background-secondary" />
                )}
              </div>

              <form className="flex flex-col gap-4">
                <label className="text-left">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    type="text"
                    className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                    value={registeringUserData?.name ?? ""}
                    placeholder="Name"
                    onChange={(e) => {
                      setRegisteringUserData({
                        ...registeringUserData,
                        name: e.target.value,
                      });
                    }}
                  />
                </label>

                <label className="text-left">
                  <span className="text-sm font-medium">Username</span>
                  <input
                    type="text"
                    className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                    value={registeringUserData?.username ?? ""}
                    placeholder="Username"
                    onChange={(e) => {
                      setRegisteringUserData({
                        ...registeringUserData,
                        username: e.target.value,
                      });
                    }}
                  />
                </label>

                <label className="text-left">
                  <span className="text-sm font-medium">Banner Image URL</span>
                  <input
                    type="text"
                    className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                    value={registeringUserData?.banner_image_url ?? ""}
                    placeholder="Banner Image URL"
                    onChange={(e) => {
                      setRegisteringUserData({
                        ...registeringUserData,
                        banner_image_url: e.target.value,
                      });
                    }}
                  />
                </label>

                <label className="text-left">
                  <span className="text-sm font-medium">Profile Image URL</span>
                  <input
                    type="text"
                    className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                    value={registeringUserData?.profile_image_url ?? ""}
                    placeholder="Profile Image URL"
                    onChange={(e) => {
                      setRegisteringUserData({
                        ...registeringUserData,
                        profile_image_url: e.target.value,
                      });
                    }}
                  />
                </label>
              </form>
            </div>

            <button
              onClick={registerNewUser}
              className="flex flex-row w-full px-3 h-10 rounded-full bg-accent hover:bg-emerald-600 text-white font-medium items-center justify-center"
            >
              Create Account
            </button>

          </div>
        )}
      </Modal>
    </>
  );
};

export default Landing;
