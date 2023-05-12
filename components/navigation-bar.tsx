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
}> = ({ isAuthenticated }) => {
  
  const { toggleColorScheme } = useColorScheme();

  const landing = useAppSelector((state) => state.landing);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { showLoginModal, setShowLoginModal, isLoadingCurrentUser, continueWithGoogle } = useAuth();

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
      sectionTitle: "Storyboard",
      sectionName: "storyboard",
    },
    {
      sectionTitle: "Wall of Love",
      sectionName: "wall-of-love",
    },
    {
      sectionTitle: "Team",
      sectionName: "team",
    },
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
              scrollToSection(homeContents[0]?.sectionName)
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
                          { "text-neutral-400": landing?.scrollY >= 100 },
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

            {auth?.currentUser ? (
              <ProfileMenu>
                <button
                  onClick={() => {
                    // logOut();
                  }}
                  className="flex flex-row gap-3"
                >
                  <div
                    className={clsx(
                      "relative w-6 h-6 rounded-full bg-dark-text-secondary overflow-hidden",
                      { "w-7 h-7": isAuthenticated }
                    )}
                  >
                    <svg
                      className="absolute h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>

                    <img
                      src={auth?.currentUser?.profile_image_url}
                      className={"absolute w-full h-full rounded-full"}
                      alt="user profile image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                      }}
                    />
                  </div>

                  {/* <span>{auth?.currentUser?.name ?? "Unknown"}</span> */}
                </button>
              </ProfileMenu>
            ) : (
              <button
                onClick={() => {
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
      </Modal>
    </>
  );
};

export default NavigationBar;
