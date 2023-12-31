import React, { Children, Fragment, useEffect, useState } from "react";
import NavigationBar from "./navigation-bar";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import {
  FiAlertTriangle,
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiEdit,
  FiFeather,
  FiHome,
  FiMenu,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSidebar,
  FiSun,
  FiUpload,
  FiX,
  FiZap,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import ProfileMenu from "./wrapper/profile-menu";
import MerseLogo from "./svgs/merse-logo";
import Divider from "./divider";
import { Combobox, Transition } from "@headlessui/react";
import { sampleArtists } from "@/util/constants/home-constant";
import { HiXCircle } from "react-icons/hi";
import { debounce, set } from "lodash";
import axios from "axios";
import { User } from "@/models/user";
import mongoose from "mongoose";
import { setScrollY, setShowNotifications } from "@/redux-store/store";
import { useNotifications } from "@/hooks/useNotifications";
import SlideOver from "./slide-over";
import { Notification } from "@/models/notification";
import NotificationAlert from "./notification";
import {
  getFormattedDateFromMongoDBDate,
  getRealTimeDateFormat,
} from "@/util/helper";
import Modal from "./modal";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // input ref
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const notificationsStore = useAppSelector((state) => state.notifications);

  const { toggleColorScheme } = useColorScheme();
  const router = useRouter();

  const [showFullSidebar, setShowFullSidebar] = React.useState(true);
  const [searchText, setSearchText] = React.useState<string>("");

  const toggleSidebar = () => {
    setShowFullSidebar(!showFullSidebar);
    localStorage.setItem("showFullSidebar", JSON.stringify(!showFullSidebar));
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<any>(null);
  const [query, setQuery] = useState("");

  const filteredSearchResults =
    searchText === ""
      ? sampleArtists
      : sampleArtists.filter((artist) => {
          return artist.name
            .trim()
            .toLowerCase()
            .includes(searchText.toLowerCase().trim());
        });

  const pathName = usePathname();

  const isCreateRoute = pathName?.split("/")[1] === "create";

  const [showNotificationSlideOver, setShowNotificationSlideOver] =
    useState<boolean>(false);
  const [showCreateOptionModal, setShowCreateOptionModal] =
    useState<boolean>(false);

  const { reloadCurrentLocalUser } = useAuth();

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const handleInputChange = (e: any) => {
    const queryText = e.target.value;
    setSearchText(queryText);
    debouncedHandleInputChange(queryText);
  };

  const fetchNotifications = async (currentUserId: string) => {
    try {
      const response = await axios({
        method: "GET",
        url: `/api/notifications/${currentUserId}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });

      setAllNotifications(response.data);
    } catch (error: any) {
      console.log("Failed to fetch notifications, message: " + error.message);
    }
  };

  const debouncedHandleInputChange = debounce(async (query: string) => {
    axios({
      method: "GET",
      url: `/api/search?query=${query}`,
      headers: {
        Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
      },
    })
      .then((response) => {
        // console.log("search result response :)))", response);
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.log("search result error :)))", error);
      });
  }, 250);

  useEffect(() => {
    const showFullSidebar = localStorage.getItem("showFullSidebar");
    if (showFullSidebar) {
      setShowFullSidebar(JSON.parse(showFullSidebar));
    }
  }, []);

  useEffect(() => {
    reloadCurrentLocalUser()
      .then((user: any) => {
        fetchNotifications(user._id);
      })
      .catch((error: any) => {
        console.log("No authenticated user found, message: " + error.message);

        // redirect to login page
        // if current route or path name is not /, then redirect to pathname and don't use router
        if (window.location.pathname !== "/") {
          window.location.pathname = "/";
        }
      });
  }, []);

  useEffect(() => {
    // log scroll value
    const handleScroll = () => {
      const scrollValue = document.getElementById("scroll-observer")?.scrollTop;
      if (scrollValue) {
        dispatch(setScrollY(scrollValue));
      }
    };

    document
      .getElementById("scroll-observer")
      ?.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNotificationRowClick = (notification: Notification) => {
    switch (notification.type) {
      case "follow":
        router.push(
          `/${notification?.sender?.username || notification?.sender?._id}`
        );
        break;
      case "like-entry":
        // router.push(`/entry/${notification?.entry?._id}`);
        alert("navigate to entry");
        break;
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen",
          { "fixed inset-0": auth?.currentUser } // unauthenticated
        )}
      >
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
                "flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-start border-none border-r-light-divider dark:border-dark-divider max-sm:hidden",
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

              <div className="flex flex-col justify-between h-full">
                {/* side menus */}
                <div className="flex flex-col w-full gap-5 items-center p-3">
                  {/* create button */}
                  <button
                    onClick={() => {
                      // router.push(`/create/${new mongoose.Types.ObjectId().toHexString()}`);
                      setShowCreateOptionModal(true);
                    }}
                    className={clsx(
                      "flex flex-row items-center gap-3 w-full transition-all rounded-xl bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary",
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
                      <FiEdit className="h-[18px] w-[18px]" />
                      {showFullSidebar && (
                        <span className="flex flex-shrink-0 font-normal">
                          Create
                        </span>
                      )}
                    </div>
                  </button>

                  {/* navigation menus */}
                  <div className="flex flex-col gap-2 w-full">
                    {/* home */}
                    <SidebarMenuButton
                      icon={
                        <FiHome
                          className={clsx(
                            { "h-[18px] w-[18px]": showFullSidebar },
                            { "w-5 h-5": !showFullSidebar }
                          )}
                        />
                      }
                      label="Home"
                      onClick={() => router.push("/")}
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/"}
                    />

                    {/* search */}
                    {/* <SidebarMenuButton
                      icon={<FiSearch className="h-5 w-5" />}
                      label="Search"
                      href="/search"
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/search"}
                    /> */}

                    {/* notifications */}
                    <SidebarMenuButton
                      icon={
                        <FiBell
                          className={clsx(
                            { "h-[18px] w-[18px]": showFullSidebar },
                            { "w-5 h-5": !showFullSidebar }
                          )}
                        />
                      }
                      label="Notifications"
                      onClick={() => setShowNotificationSlideOver(true)}
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/notifications"}
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
                    {/* <SidebarMenuButton
                      icon={
                        <FiFeather
                          className={clsx(
                            { "h-[18px] w-[18px]": showFullSidebar },
                            { "w-5 h-5": !showFullSidebar }
                          )}
                        />
                      }
                      label="Following"
                      onClick={() => router.push("/following")}
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/following"}
                    /> */}

                    {/* subscription */}
                    {/* <SidebarMenuButton
                      icon={
                        <FiZap
                          className={clsx(
                            { "h-[18px] w-[18px]": showFullSidebar },
                            { "w-5 h-5": !showFullSidebar }
                          )}
                        />
                      }
                      label="Subscription"
                      onClick={() => router.push("/subscription")}
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/subscription"}
                    /> */}

                    {/* read */}
                    <SidebarMenuButton
                      icon={
                        <FiBookOpen
                          className={clsx(
                            { "h-[18px] w-[18px]": showFullSidebar },
                            { "w-5 h-5": !showFullSidebar }
                          )}
                        />
                      }
                      label="Read Sample"
                      onClick={() =>
                        router.push("/entry/6468e2a9d3b0401f6ee8a6a8")
                      }
                      isFull={showFullSidebar}
                      isCurrentRoute={pathName === "/entry"}
                    />

                    {/* create */}
                    {/* <SidebarMenuButton
                      icon={<FiPlus className="h-5 w-5" />}
                      label="Create"
                      href="/create/styles"
                      isFull={showFullSidebar}
                      // isNew={true}
                    /> */}
                  </div>
                </div>

                {showFullSidebar && (
                  <div className="flex flex-col">
                    <div className=" p-5 border-t border-light-divider dark:border-dark-divider">
                      <span className="text-sm font-light text-light-text-secondary dark:text-dark-text-secondary">
                        ⚠️ We’re using{" "}
                        <a
                          href="https://stability.ai/stablediffusion"
                          target="_blank"
                          // className="underline text-light-text-primary dark:text-dark-text-primary"
                          className="underline text-emerald-500"
                        >
                          Stable Diffusion XL
                        </a>{" "}
                        as a placeholder while model training on our own.
                      </span>
                    </div>

                    <div className=" p-5 border-t border-light-divider dark:border-dark-divider">
                      <span className="text-sm font-light text-light-text-secondary dark:text-dark-text-secondary">
                        Product in development.
                        <br />
                        Browse our site and stay tuned for its release :))
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            id="scroll-observer"
            className="flex flex-col h-full w-full overflow-auto bg-light-background-primary dark:bg-dark-background-primary"
          >
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
                    {pathName !== "/search" && (
                      <Combobox
                        value={selectedSearchResult}
                        onChange={(result: User) => {
                          if (result.username || result._id) {
                            router.push(`/${result.username || result._id}`);
                          }

                          searchInputRef.current?.blur(); // unfocus the text input
                          setSearchText(""); // clear the search text
                        }}
                      >
                        <div
                          className={clsx(
                            "relative group flex flex-row gap-3 px-4 items-center justify-between duration-300 focus-within:w-96 h-9 rounded-full bg-light-background-secondary dark:bg-dark-background-tertiary ring-1 ring-light-dividerContrast dark:ring-dark-dividerContrast transition-all max-md:hidden focus-within:bg-opacity-70 dark:focus-within:bg-opacity-70",
                            { "w-96": searchText.length > 0 },
                            { "w-80": searchText.length === 0 }
                          )}
                        >
                          <FiSearch
                            className=" w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"
                            width={10}
                          />
                          <Combobox.Input
                            ref={searchInputRef}
                            as="input"
                            type="text"
                            value={searchText}
                            // displayValue={(result: any) => result?.name}
                            placeholder="Enter the work, artist, or genre"
                            className="w-full bg-transparent outline-none placeholder:text-light-text-primary placeholder:dark:text-dark-text-primary placeholder:text-opacity-40 dark:placeholder:text-opacity-40"
                            autoComplete="off"
                            onChange={(e: any) => handleInputChange(e)}
                          />

                          {searchText.length > 0 && (
                            <button
                              onClick={() => {
                                setSearchText("");
                              }}
                            >
                              <HiXCircle className="w-5 h-5 text-accent" />
                            </button>
                          )}

                          {/* floating element */}
                          <Combobox.Options
                            // static
                            className={
                              "flex flex-col absolute top-[calc(100%+5px)] left-[-16px] bg-light-background-primary dark:bg-dark-background-primary rounded-xl overflow-clip border border-light-divider dark:border-dark-divider drop-shadow-2xl"
                            }
                          >
                            {searchResults.map((result: any, index) => (
                              <Combobox.Option
                                // as="button"
                                key={index}
                                value={result}
                                onClick={() => {
                                  if (result._id) {
                                    router.push(`/${result._id}`);
                                    setSearchText("");
                                  }
                                }}
                                className={({ active, selected }) =>
                                  clsx(
                                    "flex select-none cursor-pointer items-center rounded-none px-4 h-[72px] w-96 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary transition-all",
                                    {
                                      "bg-light-background-tertiary dark:bg-dark-background-tertiary":
                                        active,
                                    }
                                    // { "border-b border-b-light-divider dark:border-dark-divider" : index !== filteredSearchResults.length - 1}
                                  )
                                }
                              >
                                <div className="flex flex-row gap-3 items-center">
                                  <img
                                    src={result.profile_image_url}
                                    className="h-10 w-10 rounded-full"
                                    alt="user profile image"
                                    onError={(e) => {
                                      e.currentTarget.src = "/merse-logo.png";
                                    }}
                                  />
                                  <div className="flex flex-col items-start">
                                    <span className="leading-tight font-medium">
                                      {result.name}
                                    </span>
                                    {result.username && (
                                      <span className="text-light-text-secondary dark:text-dark-text-secondary leading-tight">
                                        @{result.username}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </div>
                      </Combobox>
                    )}

                    <button
                      onClick={() => {
                        toggleColorScheme();
                      }}
                      className="flex flex-row gap-2 text-light-text-primary dark:text-dark-text-primary w-9 h-9 items-center justify-center rounded-full hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                    >
                      <FiSun className="w-5 h-5" />
                    </button>

                    <ProfileMenu
                      onCreateClicked={() => setShowCreateOptionModal(true)}
                    >
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

      {/* Notifications Slideover */}
      <SlideOver
        isOpen={showNotificationSlideOver}
        onOpen={() => {}}
        onClose={() => setShowNotificationSlideOver(false)}
        slideFrom="left"
        withOverlay={false}
        withCloseButton={true}
        withPadding={false}
        withBlurBackground={true}
        leftMargin="250px"
        size="sm"
        title="Notifications"
      >
        <div className="flex flex-col bg-red divide-light-divider dark:divide-dark-divider">
          {allNotifications.map((notification: Notification, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-between gap-3 border-none border-light-divider dark:border-dark-divider px-6 py-6 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
              >
                <div className="flex flex-row w-full gap-3 items-center justify-between">
                  <div className="flex flex-row gap-3 items-center">
                    <button>
                      <img
                        src={notification?.sender?.profile_image_url}
                        className="h-8 w-8 rounded-full"
                        onClick={() => {
                          router.push(
                            `/${
                              notification?.sender?.username ||
                              notification?.sender?._id
                            }`
                          );
                        }}
                      />
                    </button>

                    <span>
                      <Link
                        href={`/${
                          notification?.sender?.username ||
                          notification?.sender?._id
                        }`}
                        className="font-medium hover:underline"
                      >
                        {notification?.sender?.username}
                      </Link>

                      {notification?.type === "follow" && (
                        <Link
                          href={`/${
                            notification?.sender?.username ||
                            notification?.sender?._id
                          }`}
                        >
                          {" "}
                          followed you
                        </Link>
                      )}

                      {notification?.type === "like-entry" &&
                        notification?.entryId && (
                          <Link href={`/entry/${notification?.entryId}`}>
                            {" "}
                            liked your journal entry
                          </Link>
                        )}
                    </span>
                  </div>

                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium line-clamp-1 flex-shrink-0">
                    {getFormattedDateFromMongoDBDate(
                      notification?.created_at,
                      "f:Oct 19"
                    )}
                  </span>
                </div>

                {/* date in format like now, 1 min ago, ghour ago, day ago, bla bla, or date */}
                {/* <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  { getRealTimeDateFormat(noti?.created_at)}
                </span> */}
              </div>
            );
          })}
        </div>
      </SlideOver>

      <NotificationAlert
        title={notificationsStore.title}
        message={notificationsStore.message}
        isOpen={notificationsStore?.showNotifications}
        onClose={() => {
          dispatch(setShowNotifications(false));
        }}
      />

      <Modal
        title="Create New Episode"
        isOpen={showCreateOptionModal}
        onClose={() => setShowCreateOptionModal(false)}
        withPaddingTop={false}
        size="xl"
      >
        <div className="flex flex-row w-full gap-6 text-light-text-primary dark:text-dark-text-primary max-sm:gap-3">
          <CreateOptionButton
            icon={<FiEdit className="w-7 h-7" />}
            label="Create with our built-in tool"
            onClick={() => {
              router.push("/create");
              setShowCreateOptionModal(false);
            }}
          />
          <CreateOptionButton
            icon={<FiUpload className="w-7 h-7" />}
            label="Publish with external tools"
            onClick={() => {
              setShowCreateOptionModal(false);
              router.push("/publish");
            }}
          />
        </div>
      </Modal>
    </>
  );
};

const CreateOptionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex aspect-[4/3] w-96 items-center justify-center bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary rounded-lg border border-light-divider dark:border-dark-divider"
    >
      <div className="flex flex-col text-center items-center max-w-[120px] gap-3">
        <div className="group-hover:text-emerald-500 transition-all">
          {icon}
        </div>
        <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
          {label}
        </span>
      </div>
    </button>
  );
};

const SidebarMenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isFull: boolean;
  variant?: "normal" | "solid";
  isNew?: boolean;
  isCurrentRoute?: boolean;
}> = ({
  icon,
  label,
  onClick,
  isFull,
  variant = "normal",
  isNew = false,
  isCurrentRoute,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group flex flex-row items-center gap-3 w-full transition-all rounded-xl",
        { "bg-accent hover:bg-emerald-600": variant === "solid" },
        {
          "hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary duration-200":
            variant === "normal",
        },
        { "flex-col justify-center h-12 w-12 aspect-square": !isFull },
        { "flex-row justify-between pl-6 pr-3 h-12": isFull }
      )}
    >
      <div
        className={clsx(
          "flex flex-row items-center gap-3 text-base text-light-text-primary dark:text-dark-text-primary group-hover:text-opacity-100 transition-all duration-200",
          { "dark:text-opacity-100 font-medium": isCurrentRoute },
          {
            "font-normal text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary":
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
  );
};

export default HomeLayout;
