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
import { motion } from "framer-motion";

// Tweets
import {
  markQuoteRyanTweetHtml,
  ryanTweetHtml,
  markQuoteVercel,
  tweets,
} from "@/util/constants/home-constant";
import parse from "html-react-parser";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import Divider from "./divider";

type Props = {};

const footerNavigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

const Landing = (props: Props) => {
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const canvasVideoRef = useRef<HTMLVideoElement>(null);
  const [isAlexandriaVideoPlaying, setIsAlexandriaVideoPlaying] =
    React.useState<boolean>(true);
  const [isDemoVidePlaying, setIsDemoVideoPlaying] =
    React.useState<boolean>(true);
  const [isCanvasVideoPlaying, setIsCanvasVideoPlaying] =
    React.useState<boolean>(true);

  const {
    showLoginModal,
    setShowLoginModal,
    isLoadingCurrentUser,
    continueWithGoogle,
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

  const toggleCanvasDemoState = () => {
    if (canvasVideoRef.current) {
      if (canvasVideoRef.current.paused) {
        canvasVideoRef.current.play();
      } else {
        canvasVideoRef.current.pause();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col bg-black overflow-hidden">
        {/* navigation bar */}

        <NavigationBar
          isAuthenticated={false}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />

        {/* I am writing a code heheheheheheh */}

        {/* main content */}
        <div className="flex flex-col gap-0 overflow-hidden">
          {/* Hero */}
          <div
            id="about"
            className="flex relative items-center justify-center h-[100dvh] w-full"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              ref={demoVideoRef}
              src="./alexandria.mp4"
              // poster="./screenshot-storyboard.png"
              // className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.7)] bg-dark-background-primary rounded-t-2xl"
              className="h-full w-full object-cover"
              onPlay={() => {
                setIsAlexandriaVideoPlaying(true);
              }}
              onPause={() => {
                setIsAlexandriaVideoPlaying(false);
              }}
            />

            {/* <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/GO7R78zAoA4?autoplay=1&controls=0&showinfo=0&autohide=1&loop=1&mute=1&playlist=GO7R78zAoA4"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Alexandria"
              className="h-full w-full object-cover"
            ></iframe> */}

            {/* overlay */}
            <div className="absolute bg-opacity-[0.03] w-full h-full bg-gradient-to-tl from-[#FF9F0A30] to-transparent" />
            <div className="absolute bg-opacity-30 w-full h-full bg-black" />
            {/* <div className="absolute bg-opacity-75 w-full h-full bg-gradient-to-t from-[rgb(13,13,13)] to-transparent" /> */}
            <div className="absolute bg-opacity-75 w-full h-full bg-gradient-to-t from-[rgb(13,13,13)] to-transparent" />

            {/* text in the first section */}
            <motion.div
              className="absolute flex flex-col items-center w-full h-full justify-end gap-6 px-6 py-28 max-sm:py-14"
              initial={{ opacity: 0, y: 10 }} // start with opacity 0 and slightly above the final position
              animate={{ opacity: 1, y: 0 }} // animate to full opacity and final position
              transition={{ duration: 0.8 }} // duration of the animation
            >
              <div className="flex flex-col leading-6 items-center text-center">
                <h1 className="text-5xl text-white font-normal line-clamp-3 max-md::text-4xl max-sm:text-3xl leading-tight font-serif">
                  {/* Transform Journals into Comics, Effortlessly */}
                  {/* Journaling-to-Comic Made Simple */}
                  Your Stories. To Every Format.
                  {/* The Best Internet Archive, Yet. */}
                </h1>

                <span className="flex text-neutral-400 text-opacity-80 font-light text-lg max-md:text-base max-w-3xl max-md:max-w-xl">
                  We&apos;re crafting tools that transform your everyday moments, stories, experiences
                  into lasting legacies in every form — comics, books, films,
                  voice recordings, autobiographies, and beyond. 
                  
                  We&apos;re
                  developing more tools, each designed to ensure your stories,
                  your experiences, and your legacy resonate through the
                  centuries.
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

              <div className="flex flex-row gap-3">
                <button
                  className="flex flex-row items-center gap-1 rounded-full bg-transparent backdrop-blur-xl px-5 h-10 text-sm font-medium text-dark-text-primary shadow-sm transition-all border border-dark-dividerContrast border-opacity-40 hover:border-opacity-100"
                  onClick={() => {
                    window.open("https://www.youtube.com/watch?v=GO7R78zAoA4");
                  }}
                >
                  <span className=" font-medium">Video by Alexandria</span>
                </button>

                <button
                  className="flex flex-row items-center gap-1 rounded-full bg-[rgb(60,60,60,0.5)] hover:bg-opacity-80 backdrop-blur-xl pl-5 pr-3 h-10 text-sm font-medium text-dark-text-primary shadow-sm transition-all border border-dark-dividerContrast border-opacity-40 hover:border-opacity-100"
                  onClick={() => {
                    setShowLoginModal(true);
                  }}
                >
                  <span className=" font-medium">Browse the app</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-row p-6 max-sm:p-5 items-center justify-center bg-[rgb(13,13,13)] border-y border-dark-divider text-dark-text-primary transition-all">
            {/* <div className="flex flex-row p-6 max-sm:p-5 items-center justify-center bg-[rgb(13,13,13)] border-none border-dark-divider text-dark-text-primary transition-all"> */}
            <a href="https://vercel.com/ai-accelerator" target="_blank">
              {/* <img src="./accelerator-badge-dark.png" className="h-14" /> */}
              <div className="flex flex-row gap-3 items-center hover:underline">
                <img
                  src="/vercel.svg"
                  className="h-5 w-5 max-sm:w-4 max-sm:h-4"
                />
                <span className="max-sm:text-sm">
                  Accepted to Vercel AI Accelerator
                </span>
              </div>
            </a>
          </div>

          {/* <div
            id="manifesto"
            className="relative flex flex-col w-full h-[100vh] max-lg:h-auto bg-black items-center justify-center px-6 py-24 max-sm:text-xs max-sm:py-12 gap-[calc(42px+24px)]"
          >
            <div className="flex flex-col max-w-5xl gap-7 font-serif text-lg font-thin">
              <h1 className="text-dark-text-primary opacity-90">
                The Merse Manifesto
              </h1>

              <div className="flex flex-col gap-7 font-serif text-lg font-thin opacity-70">
                <p>
                  With the simplicity of a scribe and the might of a studio,
                  this tool transcends the ordinary, enabling every individual
                  to mold their experiences into a pantheon of formats—be they
                  the visual allure of comics, the tactile charm of books, or
                  the cinematic grandeur of films. It is the embodiment of a
                  dream once articulated by visionaries like Steve Jobs: to
                  merge technology with the humanities, creating tools that
                  amplify the human experience.
                </p>

                <p>
                  As we gaze into the star-studded canvas of our ever-expanding
                  universe, this innovation stands as a beacon of our
                  techno-optimist vision, a testament to our relentless pursuit
                  of progress. It&apos;s not just a platform; it&apos;s a
                  cultural metamorphosis, a digital Renaissance that
                  democratizes creation, giving voice to the voiceless and wings
                  to the tales that ground us. In this space, every spoken word,
                  every whispered dream has the potential to echo through the
                  ages, as we forge our personal legacies with the tools that
                  once seemed the province of the gods. Our stories become more
                  than memories; they are the building blocks of a civilization
                  that values every narrative, crafting a legacy that transcends
                  time and space, imbued with the essence of our collective
                  journey.
                </p>

                <span>
                  We&apos;re developing more tools, each designed to ensure your
                  stories, your experiences, and your legacy resonate through
                  the centuries.
                </span>

                <span>Mark, Kumar, and GPT-4</span>
              </div>
            </div>
          </div> */}

          <div
            id="demo"
            className="relative flex flex-col w-full h-auto max-lg:h-auto bg-dark-background-primary items-center justify-between px-6 gap-[calc(42px+24px)] border-t border-dark-divider"
          >
            <div className="absolute grid grid-cols-4 grid-rows-3 max-md:grid-cols-3 max-md:grid-rows-4 h-full opacity-[0.02] z-0">
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

            {/* <div className="flex w-full h-full bg-black absolute opacity-5" /> */}

            <div className="flex flex-col text-center items-center pt-[calc(42px+48px)] z-20">
              <h1 className="text-5xl text-dark-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl font-serif">
                {/* Storyboard */}
                Jot. Generate. Publish.
              </h1>
              <span className="flex text-light-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                {/* Jot. Generate. Publish. */}
                create comic book from a daily entry
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
            id="storyboard"
            className="relative flex flex-col w-full h-auto max-lg:h-auto items-center justify-between px-6 gap-[calc(42px+24px)] border-t border-dark-divider"
          >
            <div className="flex flex-col text-center items-center pt-[calc(42px+48px)]">
              <h1 className="text-5xl text-dark-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl font-serif">
                {/* Storyboard */}
                Canvas
              </h1>
              <span className="flex text-dark-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                Boundless imagination and more tools are yet to come.
              </span>
            </div>

            <div className="relative max-w-5xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                ref={canvasVideoRef}
                src="./merse-comic-editor-demo.mp4"
                poster="./screenshot-storyboard.png"
                className="w-full h-full object-cover shadow-[4px_24px_60px_rgb(0,0,0,0.7)] bg-dark-background-primary rounded-t-2xl"
                onPlay={() => {
                  setIsCanvasVideoPlaying(true);
                }}
                onPause={() => {
                  setIsCanvasVideoPlaying(false);
                }}
              />

              {/* play/pause button row with gradient overlay */}
              <div className="absolute bottom-0 right-0 flex flex-row w-full justify-end gap-2 px-4 pb-4 pt-6 bg-gradient-to-t from-[rgb(0,0,0,0.7)] to-transparent">
                <button
                  onClick={() => {
                    toggleCanvasDemoState();
                  }}
                  className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-full border border-neutral-400 text-white hover:scale-105 active:scale-100 transition-all"
                >
                  {isCanvasVideoPlaying ? (
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
            className="flex flex-col w-full max-lg:h-auto items-center justify-start gap-[calc(42px+24px)] py-[calc(42px+48px)] px-6 bg-dark-background-primary border-t border-dark-divider"
          >
            {/* team header text */}
            <div className="flex flex-col text-center items-center">
              <h1 className="text-5xl text-dark-text-primary font-medium leading-snug line-clamp-3 max-md::text-4xl max-sm:text-3xl font-serif">
                Wall of Love
              </h1>
              <span className="flex text-light-text-secondary text-opacity-80 font-light text-xl max-sm:text-base max-w-3xl max-md:max-w-xl">
                {/* Wall of Love */}
                Tweet from Ryan Hoover, and Airchat from Naval Ravikant
              </span>
            </div>

            <div className="flex flex-row items-center gap-5 max-lg:flex-col max-lg:items-center max-w-screen max-lg:w-full justify-center max-lg:gap-16 max-w-5xl w-full">
              {/* ryan tweets container */}
              <div className="flex flex-col max-sm:w-[calc(100vw-(28*2)px)] max-lg:w-full items-start max-lg:items-center">
                {parse(ryanTweetHtml)}

                <button
                  onClick={() => {
                    // target blank open ryanhover twitter profile
                    window.open("https://twitter.com/rrhoover", "_blank");
                  }}
                  className="flex flex-row px-6 h-12 gap-1 items-center justify-center rounded-full border border-dark-dividerContrast hover:bg-dark-background-secondary lg:w-full"
                >
                  <span className=" max-sm:text-sm">
                    Ryan Hoover, Founder of Product Hunt
                  </span>
                  <FiChevronRight className="text-accent font-medium" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <iframe
                  src="https://www.getairchat.com/sigil/sideprojects?r=afcfab29-9896-4ba0-b547-52d8d6b8197d"
                  title="Naval's Reponse"
                  className="aspect-[9/16] rounded-xl h-full"
                />
                <button
                  onClick={() => {
                    // target blank open ryanhover twitter profile
                    window.open("https://twitter.com/naval", "_blank");
                  }}
                  className="flex flex-row px-6 h-12 gap-1 items-center justify-center rounded-full border border-dark-dividerContrast hover:bg-dark-background-secondary"
                >
                  <span className=" max-sm:text-sm">
                    Naval Ravikant, Founder of AngelList
                  </span>
                  <FiChevronRight className="text-accent font-medium" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex text-white p-5 items-center justify-center w-full border-t border-dark-divider">
            <span>
              By{" "}
              <Link
                href={"https://x.com/markrachapoom"}
                target="_blank"
                className="text-white underline opacity-80"
              >
                @markrachapoom
              </Link>{" "}

              {/* and{" "} */}

              {/* <Link
                href={"https://x.com/kumareth"}
                target="_blank"
                className="text-white underline opacity-80"
              >
                @kumareth
              </Link> */}

            </span>
          </div>

          {/* team section */}
          {/* <div
            id="team"
            className="flex flex-col w-full bg-[rgb(13,13,15)] max-lg:h-auto items-center justify-start gap-[calc(42px+24px)] py-[calc(42px+24px)] px-6 border-t border-dark-divider"
          >
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
          </div> */}
        </div>
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
        withPaddingTop={false}
      >
        {!registeringUserData ? (
          <div className="flex flex-col items-center justify-start w-full h-80 text-light-text-primary dark:text-dark-text-primary gap-8 p-6 transition-all ease-in-out duration-300">
            {/* step 1 */}
            <div className="flex flex-col items-center gap-2">
              <FiBookOpen className="w-10 h-10" />

              <div>
                <h1 className="font-normal">Welcome to Merse</h1>
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
                  setRegisteringUserData(null);
                }}
                className="p-2 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary"
              >
                <FiArrowLeft className="text-light-text-secondary dark:text-dark-text-secondary" />
              </button>

              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                {registeringUserData?.email}
              </span>
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

                <div className="text-left flex flex-col items-start">
                  <span className="text-sm font-medium">Username</span>
                  <input
                    type="text"
                    className={clsx(
                      "w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent",
                      {
                        "focus:ring-light-red dark:focus:ring-dark-red":
                          registeringUserData?.username?.length > 15,
                      }
                    )}
                    value={registeringUserData?.username ?? ""}
                    placeholder="Username"
                    onChange={(e) => {
                      setRegisteringUserData({
                        ...registeringUserData,
                        username: e.target.value,
                      });
                    }}
                  />
                  <div className="flex flex-row justify-end w-full pt-1">
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {registeringUserData?.username?.length ?? 0}/15
                    </span>
                  </div>
                </div>

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
