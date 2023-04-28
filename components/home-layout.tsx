import React, { Children, useEffect, useState } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import {
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiFeather,
  FiHome,
  FiMenu,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSidebar,
  FiSun,
  FiZap,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import ProfileMenu from "./wrapper/profile-menu";
import MerseLogo from "./svgs/merse-logo";
import Divider from "./divider";
import { Combobox } from "@headlessui/react";
import { sampleArtists } from "@/util/home-constant";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // redux
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();
  const router = useRouter();

  const [showFullSidebar, setShowFullSidebar] = React.useState(true);
  const [searchText, setSearchText] = React.useState<string>("");

  const toggleSidebar = () => {
    setShowFullSidebar(!showFullSidebar);
    localStorage.setItem("showFullSidebar", JSON.stringify(!showFullSidebar));
  };

  const people = [
    "Durward Reynolds",
    "Kenton Towne",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];

  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    searchText === ""
      ? sampleArtists
      : sampleArtists.filter((artist) => {
          return artist.name.toLowerCase().includes(searchText.toLowerCase());
        });

  const pathName = usePathname();

  const isCreateRoute = pathName?.split("/")[1] === "create";

  const { reloadCurrentLocalUser } = useAuth();

  useEffect(() => {
    const showFullSidebar = localStorage.getItem("showFullSidebar");
    if (showFullSidebar) {
      setShowFullSidebar(JSON.parse(showFullSidebar));
    }
  }, []);

  useEffect(() => {
    reloadCurrentLocalUser()
      .then((user) => {})
      .catch((error: any) => {
        console.log("No authenticated user found, message: " + error.message);

        // redirect to login page
        // if current route or path name is not /, then redirect to pathname and don't use router
        if (window.location.pathname !== "/") {
          window.location.pathname = "/";
        }
      });
  }, []);

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen">
      <div
        className={clsx(
          "w-full h-full max-sm:flex max-sm:flex-col",
          { "flex flex-col": !auth?.currentUser }, // unauthenticated
          {
            "grid grid-cols-[80px_auto] duration-300":
              auth?.currentUser && !showFullSidebar && !isCreateRoute,
          }, // authenticated, hide sidebar
          {
            "grid grid-cols-[250px_auto] duration-300":
              auth?.currentUser && showFullSidebar && !isCreateRoute,
          } // authenticated, show sidebar
        )}
      >
        {/* left side bar */}
        {auth?.currentUser && (
          <div
            className={clsx(
              "flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-start border-r border-r-light-divider dark:border-dark-divider max-sm:hidden",
              { hidden: isCreateRoute }
            )}
          >
            {/* sidebar show toggle button */}
            <div
              className={clsx(
                "flex h-navigationBar w-full items-center p-3 duration-300",
                { "justify-end": showFullSidebar },
                { "justify-center": !showFullSidebar }
              )}
            >
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className="flex w-9 h-9 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary items-center justify-center rounded-xl"
              >
                {showFullSidebar ? (
                  <FiChevronsLeft className="text-light-text-secondary dark:text-dark-text-secondary w-5 h-5" />
                ) : (
                  <FiMenu className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                )}
              </button>
            </div>

            {/* side menus */}
            <div className="flex flex-col w-full gap-2 items-center p-3">
              {/* create */}
              <Link
                href={"/create/styles"}
                className="flex w-full items-center justify-center cursor-pointer pb-3"
              >
                <button
                  className={clsx(
                    "flex flex-row items-center gap-3 w-full transition-all rounded-xl bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary hover:scale-[1.025] active:scale-100",
                    {
                      "flex-col justify-center h-12 w-12 aspect-square":
                        !showFullSidebar,
                    },
                    {
                      "flex-row justify-between pl-6 pr-3 h-12":
                        showFullSidebar,
                    }
                  )}
                >
                  <div className="flex flex-row items-center gap-3">
                    <FiPlus className="h-5 w-5" />
                    {showFullSidebar && (
                      <span className="flex flex-shrink-0 font-medium">
                        Create
                      </span>
                    )}
                  </div>
                </button>
              </Link>

              {/* <Divider /> */}

              {/* home */}
              <SidebarMenuButton
                icon={<FiHome className="h-5 w-5" />}
                label="Home"
                href="/"
                isFull={showFullSidebar}
                isCurrentRoute={pathName === "/"}
              />

              {/* dashboard */}
              {/* <SidebarMenuButton
                  icon={<FiCalendar />}
                  label="Dashboard"
                  href="/dashboard"
                  isFull={showFullSidebar}
                  isNew={true}
                /> */}

              {/* subscription */}
              <SidebarMenuButton
                icon={<FiFeather className="h-5 w-5" />}
                label="Following"
                href="/following"
                isFull={showFullSidebar}
                isCurrentRoute={pathName === "/following"}
              />

              {/* subscription */}
              <SidebarMenuButton
                icon={<FiZap className="h-5 w-5" />}
                label="Subscription"
                href="/subscription"
                isFull={showFullSidebar}
                isNew={true}
                isCurrentRoute={pathName === "/subscription"}
              />

              {/* read */}
              <SidebarMenuButton
                icon={<FiBookOpen className="h-5 w-5" />}
                label="Read Sample"
                href="/6436f3032b67ae01b9c884bb"
                isFull={showFullSidebar}
                isNew={true}
                isCurrentRoute={pathName === "/6436f3032b67ae01b9c884bb"}
              />

              {/* create */}
              {/* <SidebarMenuButton
                icon={<FiPlus className="h-5 w-5" />}
                label="Create"
                href="/create/styles"
                isFull={showFullSidebar}
                // isNew={true}
              /> */}

              {/* <Divider /> */}
            </div>
          </div>
        )}
        <div className="flex flex-col h-full w-full overflow-auto">
          {/* top navigation bar */}
          {auth?.currentUser && !isCreateRoute && (
            <>
              <div className="flex flex-row w-full px-6 py-[10px] items-center justify-between sticky top-0 bg-light-background-primary dark:bg-dark-background-primary dark:bg-opacity-80 backdrop-blur-xl z-50">
                {/* arrow left and right */}
                <div className="flex flex-row gap-3 items-center">
                  <button
                    onClick={() => {
                      router.back();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      router.forward();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-row gap-3 items-center justify-center">
                  {/* search bar */}

                  <Combobox>
                    <div
                      className={clsx(
                        "relative group flex flex-row gap-3 px-4 items-center focus-within:w-96 h-9 border-light-divider dark:border-dark-divider rounded-full bg-light-background-tertiary dark:bg-dark-background-tertiary focus-within:ring-1 focus-within:ring-emerald-500 transition-all max-md:hidden focus-within:bg-light-background-primary dark:focus-within:bg-dark-background-primary",
                        { "w-96": searchText.length > 0 },
                        { "w-80": searchText.length === 0 }
                      )}
                    >
                      <FiSearch className=" w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-focus-within:text-accent" />
                      <input
                        type="text"
                        value={searchText}
                        placeholder="Enter the work, artist, or genre"
                        className="w-full bg-transparent outline-none placeholder:text-light-text-primary placeholder:dark:text-dark-text-primary placeholder:text-opacity-40 dark:placeholder:text-opacity-40"
                        onChange={(e) => {
                          setSearchText(e.target.value);
                        }}
                      />

                      {searchText.length > 0 && (
                        <Combobox.Options
                          static
                          className={
                            "absolute top-[calc(100%+8px)] left-[-16px] bg-light-background-primary dark:bg-dark-background-primary bg-opacity-95 dark:bg-opacity-95 backdrop-blur-3xl rounded-xl overflow-clip drop-shadow-2xl border border-light-divider dark:border-dark-divider"
                          }
                        >
                          {filteredPeople.map((person, index) => (
                            <Combobox.Option
                              as="button"
                              key={index}
                              value={person}
                              onClick={() => {
                                if (person._id) {
                                  router.push(`/${person._id}`);
                                }
                              }}
                              className={({ active }) =>
                                clsx(
                                  "flex select-none items-center rounded-md px-4 py-2 h-20 w-96 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary transition-all",
                                  {
                                    "bg-light-background-secondary dark:bg-dark-background-secondary bg-opacity-5":
                                      active,
                                  }
                                )
                              }
                            >
                              <div className="flex flex-row gap-3 items-center">
                                <img
                                  src={person.profile_image_url}
                                  className="h-10 w-10 rounded-full"
                                  alt="user profile image"
                                />
                                <span>{person.name}</span>
                              </div>
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>

                  <button
                    onClick={() => {
                      toggleColorScheme();
                    }}
                    className="flex flex-row gap-2 text-light-text-primary dark:text-dark-text-primary w-9 h-9 items-center justify-center rounded-full hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiSun className="w-5 h-5" />
                  </button>

                  <ProfileMenu>
                    <div className="flex items-center justify-center aspect-square">
                      <img
                        src={auth?.currentUser?.profile_image_url}
                        className={"h-8 w-8 aspect-square rounded-full"}
                        alt="user profile image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                        }}
                      />
                    </div>
                  </ProfileMenu>
                </div>
              </div>
            </>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarMenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  href: string;
  isFull: boolean;
  variant?: "normal" | "solid";
  isNew?: boolean;
  isCurrentRoute?: boolean;
}> = ({
  icon,
  label,
  href,
  isFull,
  variant = "normal",
  isNew = false,
  isCurrentRoute,
}) => {
  return (
    <Link
      href={href}
      className="group flex w-full items-center justify-center cursor-pointer"
    >
      <button
        className={clsx(
          "flex flex-row items-center gap-3 w-full transition-all rounded-xl",
          { "bg-accent hover:bg-emerald-600": variant === "solid" },
          // {
          // "hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary":
          // variant === "normal",
          // },
          { "flex-col justify-center h-12 w-12 aspect-square": !isFull },
          { "flex-row justify-between pl-6 pr-3 h-12": isFull }
        )}
      >
        <div
          className={clsx(
            "flex flex-row items-center gap-3 font-medium text-base text-light-text-primary dark:text-dark-text-primary group-hover:text-opacity-100 transition-all duration-200",
            { "text-opacity-100 dark:text-opacity-100": isCurrentRoute },
            // { "text-opacity-50 dark:text-opacity-50": !isCurrentRoute },
            {
              "text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary":
                !isCurrentRoute,
            }
          )}
        >
          {icon}
          {isFull && <span className="flex flex-shrink-0">{label}</span>}
        </div>

        {isNew && isFull && (
          <span className="text-accent text-sm font-medium px-2 py-[2px] bg-emerald-500 bg-opacity-[0.15] dark:bg-opacity-30 rounded-lg">
            New
          </span>
        )}
      </button>
    </Link>
  );
};

export default HomeLayout;
