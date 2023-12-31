"use client";

import Divider from "@/components/divider";
import SlideOver from "@/components/slide-over";
import useCreateEntry from "@/hooks/useCreateEntry";
import { Entry } from "@/models/entry";
import { User } from "@/models/user";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  setCurrentUser,
  setEntryAuthor,
  setNotificationContent,
} from "@/redux-store/store";
import { singaporeEntrySample } from "@/util/constants/profile-constants";
import {
  getFormattedDateFromMongoDBDate,
  getImageURLfromBase64,
  htmlStringToText,
} from "@/util/helper";
import { Spinner } from "@chakra-ui/react";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import {
  FiHeart,
  FiLock,
  FiMessageCircle,
  FiMoreHorizontal,
  FiPlus,
} from "react-icons/fi";

//calendar imports
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"; //don't use css?
import moment from "moment";
import { isEqual } from "date-fns";

type Props = {};

const ProfilePage = (props: Props) => {
  const localizer = momentLocalizer(moment);
  const router = useRouter();
  const pathname = usePathname();
  const createEntryUtils = useCreateEntry();

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<User | null>(null);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const [editingUserData, setEditingUserData] = useState<any | null>(null);

  const enum FollowingState {
    FOLLOWING = "following",
    NOT_FOLLOWING = "not-following",
    SELF = "self",
    UNKNOWN = "unknown",
  }

  const [followingState, setFollowingState] = useState<FollowingState>(
    FollowingState.UNKNOWN
  );
  const [isFetchingEntries, setIsFetchingEntries] = useState<boolean>(false);
  const [showProfileEditModal, setShowProfileEditModal] =
    useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  const [isBannerInputFocused, setIsBannerInputFocused] =
    useState<boolean>(false);
  const [isProfileInputFocused, setIsProfileInputFocused] =
    useState<boolean>(false);
  const [showFollowersSlideover, setShowFollowersSlideover] =
    useState<boolean>(false);
  const [showFollowingSlideover, setShowFollowingSlideover] =
    useState<boolean>(false);

  const dayPropGetter = (date: Date) => {
    if (isEqual(date, new Date(2023, 5, 8))) {
      // we can change this later (based on gpt prompting moods) with variables!!
      return {
        style: {
          backgroundColor: "rgba(250, 253, 203, 0.6)", //happy mood! 💙
        },
      };
    } else {
      return {};
    }
  };

  async function followUser(targetUserId: string) {
    try {
      // set displayed user follower count
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: [...prevUser.followers, auth?.currentUser?._id],
        };
      });
      setFollowingState(FollowingState.FOLLOWING);

      const response = await axios({
        method: "POST",
        url: `/api/users/follow`,
        data: {
          action: "follow",
          userId: auth?.currentUser?._id,
          targetUserId: targetUserId,
        },
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });
    } catch (error: any) {
      console.log("Failed to follow user, message: ", error.message);
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: prevUser.followers.filter(
            (follower) => follower !== auth?.currentUser?._id
          ),
        };
      });
      setFollowingState(FollowingState.NOT_FOLLOWING);
    }
  }

  const unfollowUser = async (targetUserId: string) => {
    try {
      setFollowingState(FollowingState.NOT_FOLLOWING);

      // set displayed user follower count
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: prevUser.followers.filter(
            (follower) => follower !== auth?.currentUser?._id
          ),
        };
      });

      const response = await axios({
        method: "POST",
        url: `/api/users/follow`,
        data: {
          action: "unfollow",
          userId: auth?.currentUser?._id,
          targetUserId: targetUserId,
        },
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });
    } catch (error: any) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: [...prevUser.followers, auth?.currentUser?._id],
        };
      });
      setFollowingState(FollowingState.FOLLOWING);
      console.log("Failed to unfollow user, message: ", error.message);
    }
  };

  const fetchUser = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // const id = pathname;
        if (!pathname) return;
        const usernameOrId = pathname.split("/")[1];

        const response = await axios({
          method: "GET",
          url: `/api/users/${usernameOrId}`,
          headers: {
            Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
          },
        });

        setUser(response.data);

        // await fetchAllEntries(response.data._id);
        resolve(response.data);

        console.log("fetched user", response.data);
      } catch (error: any) {
        console.log("jhere");
        console.log(error);
        console.log("Failed to fetch user, message: ", error.message);
        // window.location.href = "/";
      }
    });
  };

  useEffect(() => {
    // fetchAllEntries();

    // fetch user
    fetchUser()
      .then((user: any) => {
        fetchAllEntries(user._id);
      })
      .catch((error: any) => {
        console.log("Failed to fetch user, message: ", error.message);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setFollowingState(FollowingState.UNKNOWN);
      return;
    }

    if (user?._id === auth?.currentUser?._id) {
      setFollowingState(FollowingState.SELF);
      return;
    }

    if (user?.followers.some((follower) => follower._id === auth?.currentUser?._id)) {
      setFollowingState(FollowingState.FOLLOWING);
    } else {
      setFollowingState(FollowingState.NOT_FOLLOWING);
    }
  }, [auth?.currentUser?._id, user?._id]);

  const fetchAllEntries = async (user_id: string) => {
    try {
      setIsFetchingEntries(true);
      const response = await axios({
        method: "GET",
        url: `/api/entries?userId=${user_id}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });
      // console.log("response.data: ", response.data);
      const reponseData = response.data as Entry[];

      // I have some entries that contains { is_private: bool } field, and if entry?.suthor?._id === auth?.currentUser?._id, then show it
      const filteredEntries = reponseData.filter((entry) => {
        if (entry.is_private && entry.author?._id !== auth?.currentUser?._id) {
          return false;
        }
        return true;
      });

      const sortedDateEntries = filteredEntries.sort(
        (a, b) =>
          new Date(b.created_at ?? Date.now()).getTime() -
          new Date(a.created_at ?? Date.now()).getTime()
      );

      console.log("sortedDateEntries: ", sortedDateEntries);

      setAllEntries(sortedDateEntries);

      // setAllEntries(filteredEntries);
      setIsFetchingEntries(false);
    } catch (error: any) {
      // console.log(error)
      console.log("Failed to fetch entries, message: ", error.message);
    }
  };

  const updateProfile = async () => {
    try {
      setIsSavingProfile(true);

      // if no update close modal
      if (!isUpdatingDataChanged()) {
        setShowProfileEditModal(false);
        return;
      }

      const updatedUserReponse = await axios({
        method: "PUT",
        url: `/api/users`,
        data: editingUserData,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });

      setUser(updatedUserReponse.data);
      dispatch(setCurrentUser(updatedUserReponse.data));

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUserReponse.data)
      );

      setShowProfileEditModal(false);
      dispatch(
        setNotificationContent({
          title: "Profile updated",
          message: "Your profile has been updated",
        })
      );

      setIsSavingProfile(false);

      // if username changed, then navigate to new username
      if (user?.username !== updatedUserReponse.data.username) {
        router.push(`/${updatedUserReponse.data.username}`);
      }
    } catch (error: any) {
      setIsSavingProfile(false);
      if (error.response.data.error === "Username already exists") {
        alert("Username already exists");
        return;
      }

      console.log("Failed to update profile, message: ", error.message);
    }
  };

  const isUpdatingDataChanged = () => {
    return user !== editingUserData;
  };

  const tabs = [
    { name: "Series", href: "series"},
    { name: "Entries", href: "entries" },
    { name: "Calendar", href: "calendar" },
    { name: "Collection", href: "collection" },
    { name: "About", href: "about" },
  ];

  const [currentTab, setCurrentTab] = useState<string>("entries");

  // add listerner to window.location.hash
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    setActiveHash(hash);
  });

  const [activehash, setActiveHash] = useState<string>("#entries");

  return (
    <>
      <div className="flex flex-col w-full items-center">
        
        {/* banner */}
        <div className="flex w-full h-[30vh] bg-light-background-secondary dark:bg-dark-background-secondary flex-shrink-0">
          {user?.banner_image_url ? (
            <img
              src={user?.banner_image_url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary" />
          )}
        </div>

        <div className="flex flex-col px-6 w-full items-center -translate-y-[64px]">
          <div className="flex flex-col w-full max-w-5xl gap-10">
            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-row justify-between items-end">
                {/* profile image */}

                <div className="w-32 h-32 bg-light-background-secondary dark:bg-dark-background-secondary rounded-full overflow-clip">
                  {user?.profile_image_url ? (
                    <img
                      src={user?.profile_image_url}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.currentTarget.src = "/merse-logo.png";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-light-background-secondary dark:bg-dark-background-secondary" />
                  )}
                </div>

                {user && (
                  <button
                    onClick={() => {
                      switch (followingState) {
                        case FollowingState.NOT_FOLLOWING:
                          followUser(user?._id);
                          break;
                        case FollowingState.FOLLOWING:
                          unfollowUser(user?._id);
                          break;
                        case FollowingState.SELF:
                          setEditingUserData(user);
                          setShowProfileEditModal(true);
                          break;
                      }
                    }}
                    className={clsx(
                      "h-10 w-28 font-medium rounded-full border border-light-dividerContrast dark:border-dark-dividerContrast",
                      {
                        "hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary":
                          followingState === FollowingState.SELF,
                      }, // self
                      {
                        "text-dark-text-primary dark:text-light-text-primary bg-light-text-primary dark:bg-dark-text-primary":
                          followingState === FollowingState.NOT_FOLLOWING,
                      }, // not self
                      { "": followingState === FollowingState.FOLLOWING } // following
                    )}
                  >
                    {followingState === FollowingState.FOLLOWING && "Following"}
                    {followingState === FollowingState.NOT_FOLLOWING &&
                    !user?.followings?.some((user) => user._id === auth?.currentUser?._id) &&
                      "Follow"}
                    {followingState === FollowingState.NOT_FOLLOWING &&
                      user?.followings?.some((user) => user._id === auth?.currentUser?._id) &&
                      "Follow Back"}
                    {followingState === FollowingState.SELF && "Edit Profile"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  {/* name */}
                  <span className="text-2xl font-bold leading-tight">
                    {user?.name}
                  </span>

                  <div className="flex flex-row gap-3 items-center">
                    {/* username */}

                    {user?.username && (
                      <span className="text-light-text-secondary dark:text-dark-text-secondary leading-snug">
                        @{user?.username}
                      </span>
                    )}

                    {user?.followings?.some((user) => user._id === auth?.currentUser?._id) && (
                      <span className="text-[0.75rem] font-medium px-2 py-[2px] bg-light-background-secondary dark:bg-dark-background-secondary rounded-md text-light-text-secondary dark:text-dark-text-secondary">
                        Follows You
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowFollowersSlideover(true);
                    }}
                  >
                    {user?.followers?.length}{" "}
                    <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">
                      Followers
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowFollowingSlideover(true);
                    }}
                  >
                    {user?.followings?.length}{" "}
                    <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">
                      Following
                    </span>
                  </button>
                </div>

                {user?.bio && user?.bio !== "" && (
                  <p className="max-w-sm font-normal">{user?.bio}</p>
                )}
              </div>
            </div>

            <div className="border-b border-light-divider dark:border-dark-divider">
              <nav className="-mb-px flex" aria-label="Tabs">
                {tabs.map((tab: any) => (
                  <button
                    key={tab.name}
                    // href={`${location.pathname}/${tab.href}`}
                    onClick={() => {
                      setCurrentTab(tab.href);
                    }}
                    className={clsx(
                      "whitespace-nowrap border-b-2 py-4 font-medium px-6 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
                      // when click it adds #tab to link, change tab.current to sync with url
                      { "border-accent text-accent": currentTab === tab.href },
                      {
                        "border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary":
                          currentTab !== tab.href,
                      }
                    )}
                    // aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* <span>{activehash} compared {tabs[0].href}</span> */}
            </div>

            {currentTab === "calendar" && (
              <div className="h-[500px]">
                <Calendar
                  localizer={localizer}
                  events={[]}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  views={["month"]}
                  dayPropGetter={dayPropGetter}
                />
              </div>
            )}

            {currentTab === "entries" && (
              <div className="flex flex-col gap-6 w-full">
                {isFetchingEntries ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-row w-full h-56 animate-pulse bg-light-background-secondary dark:bg-dark-background-secondary rounded-md"
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {/* {[
                    singaporeEntrySample,
                    singaporeEntrySample,
                    singaporeEntrySample,
                    singaporeEntrySample,
                  ].map((entry: any, index: number) => ( */}
                    {allEntries.map((entry: Entry, index: number) => (
                      <>
                        <div
                          key={index}
                          className="flex flex-row w-full h-56 py-6 border-light-divider dark:border-dark-divider rounded-none overflow-clip gap-6"
                        >
                          <Link
                            href={`entry/${entry?._id}`}
                            className="flex-shrink-0"
                          >
                            {/* { (entry?.scenes[0]?.image_base64 || entry?.cover?.image_url) ? (
                              <img
                                src={
                                  entry?.scenes[0]?.image_base64
                                    ? getImageURLfromBase64(
                                        entry?.scenes[0]?.image_base64
                                      )
                                    : entry?.cover?.image_url
                                }
                                className="h-full aspect-square object-cover rounded-none"
                              />
                            ) : ( */}
                            <div className="h-full aspect-square bg-light-background-secondary dark:bg-dark-background-secondary"></div>
                            {/* )} */}
                          </Link>

                          <div className="flex flex-col justify-start w-full h-full gap-1 items-start">
                            <div className="flex flex-row w-full justify-between flex-shrink-0">
                              <div className="flex flex-row items-center gap-2">
                                {/* author info */}
                                <Link
                                  className="flex flex-row gap-2 items-center hover:underline"
                                  href={`/${
                                    entry?.author?.username ||
                                    entry?.author?._id
                                  }`}
                                >
                                  <img
                                    src={entry?.author?.profile_image_url}
                                    className="w-6 h-6 rounded-full aspect-square"
                                  />

                                  <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                                    {entry?.author?.username ||
                                      entry?.author?.name ||
                                      "Unknown"}
                                  </span>
                                </Link>

                                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">
                                  {getFormattedDateFromMongoDBDate(
                                    entry?.created_at
                                  )}
                                </span>

                                {entry?.is_private && (
                                  <FiLock className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                                )}
                              </div>

                              <div className="flex flex-row items-center gap-3">
                                {/* likes */}
                                <button className="flex flex-row items-center">
                                  <FiHeart className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                  <span className="text-sm font-medium ml-[5px]">
                                    {entry?.likes?.length || 0}
                                  </span>
                                </button>

                                {/* comments */}
                                <button className="flex flex-row items-center">
                                  <FiMessageCircle className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                  <span className="text-sm font-medium ml-1">
                                    {entry?.comments?.length || 0}
                                  </span>
                                </button>

                                {/* options */}

                                <Menu
                                  as="div"
                                  className="relative inline-block text-left"
                                >
                                  {({ open }) => (
                                    <>
                                      <div>
                                        <Menu.Button
                                          className={clsx(
                                            "group flex w-8 h-8 hover:bg-emerald-500 hover:bg-opacity-10 items-center justify-center rounded-full",
                                            {
                                              "bg-emerald-500 bg-opacity-10":
                                                open,
                                            }
                                          )}
                                        >
                                          <FiMoreHorizontal
                                            className={clsx(
                                              "w-5 h-5 group-hover:text-emerald-500",
                                              { "text-emerald-500": open },
                                              {
                                                "text-light-text-secondary dark:text-dark-text-secondary":
                                                  !open,
                                              }
                                            )}
                                          />
                                        </Menu.Button>
                                      </div>

                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-150"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-100"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className="absolute top-full right-1/2 z-10 w-44 origin-top-right divide-y divide-light-divider dark:divide-dark-divider rounded-md bg-light-background-primary dark:bg-dark-background-secondary focus:outline-none ring-1 ring-light-divider dark:ring-dark-divider drop-shadow-lg">
                                          <div className="py-1">
                                            {followingState ===
                                              FollowingState.SELF && (
                                              <>
                                                <Menu.Item>
                                                  {({ active }) => (
                                                    <button
                                                      onClick={() => {
                                                        router.push(
                                                          `/create/${entry._id}`
                                                        );
                                                      }}
                                                      className={clsx(
                                                        "text-sm flex flex-row items-center justify-start w-full px-3 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary",
                                                        {
                                                          "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                                            active,
                                                        },
                                                        { "": !active }
                                                      )}
                                                    >
                                                      Edit
                                                    </button>
                                                  )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                  {({ active }) => (
                                                    <button
                                                      onClick={() => {
                                                        axios({
                                                          method: "DELETE",
                                                          url: `/api/entries?id=${entry?._id}`,
                                                          headers: {
                                                            Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
                                                          },
                                                        })
                                                          .then((res) => {
                                                            // remove deleted entry from current array with filter
                                                            setAllEntries(
                                                              (prev) =>
                                                                prev.filter(
                                                                  (e) =>
                                                                    e._id !==
                                                                    entry._id
                                                                )
                                                            );
                                                          })
                                                          .catch((err) => {
                                                            alert(
                                                              "Something went wrong. Please try again later."
                                                            );
                                                            console.log(err);
                                                          });
                                                      }}
                                                      className={clsx(
                                                        "text-sm flex flex-row items-center justify-start w-full px-3 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary",
                                                        {
                                                          "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                                            active,
                                                        },
                                                        { "": !active }
                                                      )}
                                                    >
                                                      Delete
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                              </>
                                            )}

                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(
                                                      `${window.location.origin}/entry/${entry._id}`
                                                    );

                                                    dispatch(
                                                      setNotificationContent({
                                                        title: "Link Copied",
                                                        message:
                                                          "Entry link copied to clipboard.",
                                                      })
                                                    );
                                                  }}
                                                  className={clsx(
                                                    "text-sm flex flex-row items-center justify-start w-full px-3 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary",
                                                    {
                                                      "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                                        active,
                                                    },
                                                    { "": !active }
                                                  )}
                                                >
                                                  Copy Entry Link
                                                </button>
                                              )}
                                            </Menu.Item>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </>
                                  )}
                                </Menu>
                              </div>
                            </div>

                            {/* title and description */}
                            <Link
                              href={`/entry/${entry._id}`}
                              className="flex flex-col w-full h-full"
                            >
                              <p className="font-semibold text-2xl flex-shrink-0 leading-normal line-clamp-1">
                                {entry.title}
                              </p>

                              <p className="text-light-text-secondary dark:text-dark-text-secondary line-clamp-4 leading-normal">
                                {htmlStringToText(entry.content ?? "")}
                              </p>
                            </Link>

                            {/* tags */}
                            <div className="flex flex-row w-full gap-3 items-center justify-end opacity-0">
                              asd
                            </div>
                          </div>
                        </div>

                        <Divider />
                      </>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Followers Slideover */}
      <SlideOver
        isOpen={showFollowersSlideover}
        size="sm"
        onClose={() => {
          setShowFollowersSlideover(false);
        }}
        title={"Followers"}
        withPadding={false}
      >
        <div className="flex flex-col">
          {user?.followers.map((user, index: number) => (
            <UserRowInfo key={index} user={user} />
          ))}
        </div>
      </SlideOver>

      {/* Following Slideover */}
      <SlideOver
        isOpen={showFollowingSlideover}
        size="sm"
        onClose={() => {
          setShowFollowingSlideover(false);
        }}
        title={"Following"}
        withPadding={false}
      >
        <div className="flex flex-col">
          {user?.followings.map((user, index: number) => (
            <UserRowInfo key={index} user={user} />
          ))}
        </div>
      </SlideOver>

      {/* creating new character slideover */}
      <SlideOver
        isOpen={showProfileEditModal}
        size="lg"
        onClose={() => {
          setShowProfileEditModal(false);
        }}
        // title={editingCharacter ? `Edit ${editingCharacter?.name}` : "Create New Character"}
        title={"Edit Profile"}
        footer={
          <div className="flex flex-shrink-0 justify-end items-center px-4 py-4 gap-3">
            <div className="flex flex-row gap-3">
              <button
                type="button"
                className="border border-light-divider dark:border-dark-divider w-24 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary rounded-full"
                onClick={() => {
                  setShowProfileEditModal(false);
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => updateProfile()}
                type="submit"
                className="flex flex-row bg-accent w-28 h-10 text-white rounded-full items-center justify-center"
                disabled={isSavingProfile}
              >
                {isSavingProfile && <Spinner className="w-3 h-3 mr-2" />}
                {isSavingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        }
      >
        {/* create/edit character slideover content */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full h-40 items-center justify-center">
            {editingUserData?.banner_image_url ? (
              <img
                src={editingUserData?.banner_image_url}
                className={clsx("w-full h-full object-cover", {
                  "ring-2 ring-accent ring-opacity-70": isBannerInputFocused,
                })}
              />
            ) : (
              <div className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary" />
            )}
          </div>

          <div className="flex flex-col w-full -translate-y-[56px] gap-7">
            {/* circle image input */}
            <div className="group relative w-28 h-28 border border-light-divider dark:border-dark-divider rounded-full mx-4">
              {editingUserData?.profile_image_url &&
              editingUserData.profile_image_url !== "" ? (
                <img
                  src={editingUserData.profile_image_url}
                  className={clsx(
                    "absolute w-full h-full object-cover rounded-full",
                    {
                      "ring-2 ring-accent ring-opacity-80":
                        isProfileInputFocused,
                    }
                  )}
                  alt="character face"
                />
              ) : (
                <div className="flex absolute w-full h-full items-center justify-center aspect-square bg-light-background-secondary dark:bg-dark-background-secondary rounded-full group-hover:bg-light-background-tertiary dark:group-hover:bg-dark-background-tertiary transition-all group-active:opacity-50">
                  <FiPlus className="w-7 h-7 text-light-text-tertiary  dark:text-dark-text-secondary" />
                  <input
                    type="file"
                    className="group absolute w-full h-full opacity-0 rounded-full hover:cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      e.preventDefault();
                      // if (e.target.files && e.target.files[0]) {
                      //   setCharacterImageData(e.target.files[0]);
                      //   setCharacterImageURL(
                      //     URL.createObjectURL(e.target.files[0])
                      //   );
                      // }
                    }}
                  />
                </div>
              )}
            </div>

            <form
              className="flex flex-col w-full gap-7"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="Banner Image URL"
                  className="flex text-sm font-medium leading-6"
                >
                  Banner Image URL
                </label>

                <input
                  type="text"
                  name="imageURL"
                  id="imageURL"
                  onFocus={(e) => {
                    setIsBannerInputFocused(true);
                  }}
                  onBlur={(e) => {
                    setIsBannerInputFocused(false);
                  }}
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingUserData?.banner_image_url ?? ""}
                  placeholder="Enter banner image URL"
                  onChange={(e) => {
                    setEditingUserData({
                      ...editingUserData,
                      banner_image_url: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="Image URL"
                  className="flex text-sm font-medium leading-6"
                >
                  Profile Image URL
                </label>

                <input
                  type="text"
                  name="imageURL"
                  id="imageURL"
                  onFocus={(e) => {
                    setIsProfileInputFocused(true);
                  }}
                  onBlur={(e) => {
                    setIsProfileInputFocused(false);
                  }}
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingUserData?.profile_image_url ?? ""}
                  placeholder="Enter profile image URL"
                  onChange={(e) => {
                    setEditingUserData({
                      ...editingUserData,
                      profile_image_url: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="flex text-sm font-medium leading-6"
                >
                  Username
                </label>

                <input
                  type="text"
                  name="name"
                  id="name"
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingUserData?.username ?? ""}
                  placeholder="Enter your username"
                  onChange={(e) => {
                    setEditingUserData({
                      ...editingUserData,
                      username: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="flex text-sm font-medium leading-6"
                >
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  id="name"
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingUserData?.name ?? ""}
                  placeholder="Enter your name"
                  onChange={(e) => {
                    setEditingUserData({
                      ...editingUserData,
                      name: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="flex text-sm font-medium"
                >
                  Bio
                </label>

                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md min-h-[100px] border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingUserData?.bio ?? ""}
                  placeholder="Enter your bio"
                  onChange={(e) => {
                    setEditingUserData({
                      ...editingUserData,
                      bio: e.target.value,
                    });
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </SlideOver>
    </>
  );
};

// User Row Info React Component
const UserRowInfo: React.FC<{ user: User }> = ({ user }) => {

  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/${user?.username || user?._id}`);
      }}
      className="flex flex-row items-center justify-between gap-3 border-none border-light-divider dark:border-dark-divider px-6 py-6 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
    >
      <div className="flex flex-row w-full gap-3 items-center justify-between">
        <div className="flex flex-row gap-3 items-center">
          <button>
            <img
              src={user?.profile_image_url}
              className="h-10 w-10 rounded-full"
            />
          </button>

          <div className="flex flex-col gap-0 items-start">
            <span className="font-medium leading-tight">
              {user?.name}
            </span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary leading-tight">
              @{user?.username}
            </span>
          </div>
        </div>
      </div>

      {/* date in format like now, 1 min ago, ghour ago, day ago, bla bla, or date */}
      {/* <span className="text-light-text-secondary dark:text-dark-text-secondary">
              { getRealTimeDateFormat(noti?.created_at)}
            </span> */}
    </button>
  );
};

export default ProfilePage;
