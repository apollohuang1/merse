"use client";

import Divider from "@/components/divider";
import SlideOver from "@/components/slide-over";
import { Entry } from "@/models/entry";
import { User } from "@/models/user";
import { useAppSelector } from "@/redux-store/hooks";
import { getImageURLfromBase64 } from "@/util/helper";
import axios from "axios";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

type Props = {};

const ProfilePage = (props: Props) => {
  useEffect(() => {
    // fetchAllEntries();

    // fetch user
    fetchUser()
      .then((user: any) => {
        fetchAllEntries(user._id);
      })
      .catch((error: any) => {
        // console.log("Failed to fetch user, message: ", error.message);
      });
  }, []);

  const router = useRouter();

  const auth = useAppSelector((state) => state.auth);

  const [user, setUser] = useState<User | null>(null);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const [editingBannerURL, setEditingBannerURL] = useState<string>("");
  const [editingProfileURL, setEditingProfileURL] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<string>("");
  const [editingName, setEditingName] = useState<string>("");
  const [editingBio, setEditingBio] = useState<string>("");

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

  const pathname = usePathname();

  // async function followUser(userId, targetUserId) {
  //   const user = await User.findById(userId);
  //   const targetUser = await User.findById(targetUserId);

  //   if (!user.followings.includes(targetUserId)) {
  //     user.followings.push(targetUserId);
  //     targetUser.followers.push(userId);

  //     await user.save();
  //     await targetUser.save();
  //   }
  // }

  async function followUser(targetUserId: string) {
    try {
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
        }
      });

      setFollowingState(FollowingState.FOLLOWING);

      // set displayed user follower count
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: [...prevUser.followers, auth?.currentUser?._id],
        };
      });
    } catch (error: any) {
      console.log("Failed to follow user, message: ", error.message);
    }
  }

  const unfollowUser = async (targetUserId: string) => {
    try {
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
        }
      });

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
    } catch (error: any) {
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
          }
        })

        setUser(response.data);
        console.log("user: ", response.data);

        if (response.data._id === auth?.currentUser?._id) {
          setFollowingState(FollowingState.SELF);
        } else {
          if (response.data.followers.includes(auth?.currentUser?._id)) {
            setFollowingState(FollowingState.FOLLOWING);
          } else {
            setFollowingState(FollowingState.NOT_FOLLOWING);
          }
        }

        // await fetchAllEntries(response.data._id);
        resolve(response.data);
      } catch (error: any) {
        console.log("Failed to fetch user, message: ", error.message);
        window.location.href = "/";
      }
    });
  };

  const fetchAllEntries = async (user_id: string) => {
    try {
      setIsFetchingEntries(true);
      const response = await axios({
        method: "GET",
        url: `/api/entries?userId=${user_id}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        }
      })
      setAllEntries(response.data);
      setIsFetchingEntries(false);
    } catch (error: any) {
      console.log("Failed to fetch entries, message: ", error.message);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await axios({
        method: "PUT",
        url: `/api/users`,
        data: {
          _id: user?._id,
          banner_image_url: editingBannerURL,
          profile_image_url: editingProfileURL,
          username: editingUsername,
          name: editingName,
          bio: editingBio,
        },
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        }
      });
      await fetchUser();
      // setUser(response.data);
      setShowProfileEditModal(false);
    } catch (error: any) {
      if (error.response.data.error === "Username already exists") {
        alert("Username already exists");
        return;
      }

      console.log("Failed to update profile, message: ", error.message);
    }
  };

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
          <div className="flex flex-col w-full max-w-5xl gap-12">
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
                          setEditingProfileURL(user?.profile_image_url);
                          setEditingBannerURL(user?.banner_image_url);
                          setEditingUsername(user?.username);
                          setEditingName(user?.name);
                          setEditingBio(user?.bio);
                          setShowProfileEditModal(true);
                          break;
                      }
                    }}
                    className={clsx(
                      "h-10 w-28 font-medium rounded-full border border-light-divider dark:border-dark-divider",
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
                      "Follow"}
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

                  {/* username */}
                  {user?.username && (
                    <span className="text-light-text-secondary dark:text-dark-text-secondary leading-snug">
                      @{user?.username}
                    </span>
                  )}
                </div>

                <div className="flex flex-row gap-3">
                  <span>
                    {user?.followers?.length}{" "}
                    <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">
                      Followers
                    </span>
                  </span>
                  {/* <span>
                    {user?.followings?.length}{" "}
                    <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">
                      Following
                    </span>
                  </span> */}
                </div>

                <p className="max-w-sm font-normal">
                  {user?.bio ??
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis lectus magna, ut rutrum justo interdum sed. Aliquam erat elit."}
                </p>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 w-full">
              {isFetchingEntries ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full animate-pulse aspect-square bg-light bg-light-background-secondary dark:bg-dark-background-secondary rounded-md"
                    />
                  ))}
                </>
              ) : (
                <>
                  {allEntries.map((entry: Entry, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        router.push(`/entry/${entry._id}`);
                      }}
                      className="flex flex-col w-full items-center justify-between bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary rounded-md overflow-clip"
                    >
                      {entry?.scenes[0]?.image_base64 ? (
                        <img
                          src={getImageURLfromBase64(
                            entry?.scenes[0]?.image_base64
                          )}
                          className="w-full h-full aspect-square object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-300 dark:bg-emerald-800"></div>
                      )}

                      <div className="flex flex-row px-6 py-4 items-center justify-start w-full text-left">
                        <span className="line-clamp-1">{entry.title}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* creating new character slideover */}
      <SlideOver
        isOpen={showProfileEditModal}
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
                className="bg-accent w-24 h-10 text-white rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        }
      >
        {/* create/edit character slideover content */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full h-40 items-center justify-center">
            {editingBannerURL ? (
              <img
                src={editingBannerURL}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary" />
            )}
          </div>

          <div className="flex flex-col w-full -translate-y-[56px] gap-7">
            {/* circle image input */}
            <div className="group relative w-28 h-28 border border-light-divider dark:border-dark-divider rounded-full mx-4">
              {editingProfileURL && editingProfileURL !== "" ? (
                <img
                  src={editingProfileURL}
                  className="absolute w-full h-full object-cover rounded-full"
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
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingBannerURL ?? ""}
                  placeholder="Enter banner image URL"
                  onChange={(e) => {
                    setEditingBannerURL(e.target.value);
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
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-accent rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={editingProfileURL ?? ""}
                  placeholder="Enter profile image URL"
                  onChange={(e) => {
                    setEditingProfileURL(e.target.value);
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
                  value={editingUsername ?? ""}
                  placeholder="Enter your name"
                  onChange={(e) => {
                    setEditingUsername(e.target.value);
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
                  value={editingName ?? ""}
                  placeholder="Enter your name"
                  onChange={(e) => {
                    setEditingName(e.target.value);
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
                  value={editingBio ?? ""}
                  placeholder="Enter your bio"
                  onChange={(e) => {
                    setEditingBio(e.target.value);
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

export default ProfilePage;
