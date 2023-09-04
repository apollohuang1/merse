import React from "react";
import MerseLogo from "./svgs/merse-logo";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiChevronRight,
  FiLogOut,
  FiSun,
  FiUser,
} from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import Modal from "./modal";
import { FcGoogle } from "react-icons/fc";
import useColorScheme from "@/hooks/useColorScheme";
import ProfileMenu from "./wrapper/profile-menu";

const NavigationBar: React.FC<{
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isAuthenticated, showLoginModal, setShowLoginModal }) => {
  const { toggleColorScheme } = useColorScheme();

  const landing = useAppSelector((state) => state.landing);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { isLoadingCurrentUser, continueWithGoogle } = useAuth();

  const scrollToSection = (sectionName: string) => {
    const section = document.getElementById(sectionName);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const homeContents: any[] = [
    {
      sectionTitle: "About",
      sectionName: "about",
    },
    {
      sectionTitle: "Demo",
      sectionName: "demo",
    },
    {
      sectionTitle: "Wall of Love",
      sectionName: "wall-of-love",
    },
    // {
    //   sectionTitle: "Team",
    //   sectionName: "team",
    // },
    // {
    //   sectionTitle: "Contact",
    // }
  ];

  return (
    <>
      <div
        className={clsx(
          "flex w-full items-center justify-center z-10 transition px-6",
          {
            "bg-gradient-to-b from-[rgb(0,0,0,0.7)] to-transparent":
              landing?.scrollY < 100 && isAuthenticated === false,
          },
          {
            "bg-[rgb(13,13,14,0.7)] backdrop-blur-xl":
              landing?.scrollY >= 100 && isAuthenticated === false,
          },
          {
            "bg-light-background-primary dark:bg-dark-background-primary":
              isAuthenticated,
          },
          { "fixed top-0 h-landingNavigationBar": isAuthenticated === false }, // landing
          {
            "sticky top-0 h-navigationBar bg-light-background-primary dark:bg-dark-background-primary border-b border-b-light-divider dark:border-b-dark-divider":
              isAuthenticated,
          } // home page
        )}
      >
        <div
          className={clsx(
            "text-white py-2 w-full",
            {
              "grid grid-cols-3 max-w-5xl h-landingNavigationBar max-md:flex max-md:flex-row max-md:justify-between":
                !isAuthenticated,
            },
            {
              "flex flex-row h-navigationBar items-center justify-between":
                isAuthenticated,
            }
          )}
        >
          {/* logo and name */}
          <div
            className="flex flex-row items-center gap-2 cursor-pointer active:opacity-75 transition-all text-light-text-primary dark:text-dark-text-primary"
            onClick={() => {
              // with smooth scroll
              scrollToSection(homeContents[0]?.sectionName);
            }}
          >
            <MerseLogo theme="dark" />
            <span className="text-white">Comic</span>
          </div>

          {/* section navigator */}
          {isAuthenticated === false && (
            <div className="flex flex-row w-full justify-center max-md:hidden">
              <div className="flex flex-row">
                {/* capsult tab picker to scroll to three pages below with animation */}
                <div className="flex flex-row">
                  {homeContents.map((item: any, index: number) => {
                    return (
                      <button
                        onClick={() => {
                          scrollToSection(item?.sectionName);
                        }}
                        key={index}
                        className={clsx(
                          `flex flex-row flex-shrink-0 items-center gap-2 hover:text-white font-light px-4 rounded-full transition-all active:opacity-50`,
                          {
                            "text-neutral-300": landing?.scrollY < 100,
                          },
                          { "text-neutral-400": landing?.scrollY >= 100 }
                        )}
                      >
                        <span className="text-sm">{item?.sectionTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* login button */}
          <div className="flex flex-row items-center justify-end gap-3 h-full">
            {/* toggle color scheme */}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    toggleColorScheme();
                  }}
                  className="flex flex-row gap-2 text-light-text-primary dark:text-dark-text-primary w-7 h-7 items-center justify-center rounded-full hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
                >
                  <FiSun className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowLoginModal(true);
              }}
              className="flex items-center justify-center text-white bg-accent hover:bg-emerald-600 px-3 rounded-full h-6"
            >
              <span className="text-sm font-medium">Login</span>
            </button>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
