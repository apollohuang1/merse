"use client";

import { Entry } from "@/models/entry";
import { getImageURLfromBase64 } from "@/util/helper";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

type Props = {};

const ProfilePage = (props: Props) => {
  useEffect(() => {
    // fetchAllEntries();

    // fetch user
    fetchUser();
  }, []);

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const id = pathname;
      if (!id) return;
      const userId = id.split("/")[1];
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      fetchAllEntries(response.data._id);
    } catch (error: any) {
      console.log("Failed to fetch user, message: ", error.message);
    }
  };

  const fetchAllEntries = async (user_id: string) => {
    try {
      const response = await axios.get(`/api/entries?userId=${user_id}`);
      setAllEntries(response.data);
    } catch (error: any) {
      console.log("Failed to fetch entries, message: ", error.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      {/* banner */}

      {user?.banner_image_url ? (
        <img
          src={
            "https://pbs.twimg.com/profile_banners/727846811713437696/1670934193/1500x500"
          }
          className="w-full h-[30vh] object-cover"
        />
      ) : (
        <div className="w-full h-[30vh] bg-light-background-secondary dark:bg-dark-background-secondary" />
      )}

      <div className="flex flex-col px-6 w-full h-full items-center -translate-y-[64px]">
        <div className="flex flex-col w-full h-full max-w-5xl gap-6">
          <div className="flex flex-col w-full gap-3">
            {/* profile image */}
            <img
              src={user?.profile_image_url}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="flex flex-col gap-2">
              {/* name */}
              <span className="text-2xl font-bold">{user?.name ?? "Unknown"}</span>

              <p className="max-w-sm font-normal">
                { user?.bio ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis lectus magna, ut rutrum justo interdum sed. Aliquam erat elit." }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2">
            {allEntries.map((entry: Entry, index: number) => (
              <button
                key={index}
                onClick={() => {
                  router.push(`/read?id=${entry._id}`);
                }}
                className="flex flex-col w-full items-center justify-between bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
              >
                {entry?.scenes[0]?.image_base64 ? (
                  <img
                    src={getImageURLfromBase64(entry?.scenes[0]?.image_base64)}
                    className="w-full h-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-300 dark:bg-emerald-800"></div>
                )}

                <div className="flex flex-row p-6 items-center justify-start w-full">
                  <span>{entry.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
