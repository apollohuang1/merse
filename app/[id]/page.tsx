"use client";

import { Entry } from "@/models/entry";
import { getImageURLfromBase64 } from "@/util/helper";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

type Props = {};

const ProfilePage = (props: Props) => {
  useEffect(() => {
    fetchAllEntries();
  }, []);

  const router = useRouter();

  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const fetchAllEntries = async () => {
    try {
      const response = await axios.get(
        `/api/entries?userId=6436f3032b67ae01b9c884bb`
      );
      setAllEntries(response.data);

      console.log("All entries");
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      {/* banner */}
      <img
        src={
          "https://pbs.twimg.com/profile_banners/727846811713437696/1670934193/1500x500"
        }
        className="w-full h-[30vh] object-cover"
      />

      <div className="flex flex-col px-6 w-full h-full items-center -translate-y-[64px]">
        <div className="flex flex-col w-full h-full max-w-5xl gap-6">
          <div className="flex flex-col w-full gap-3">
            {/* profile image */}
            <img
              src={
                "https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg"
              }
              className="w-32 h-32 rounded-full object-cover"
            />

            <div>
              {/* name */}
              <span className="text-2xl font-bold">{"Mark"}</span>

              <p className="max-w-sm font-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                convallis lectus magna, ut rutrum justo interdum sed. Aliquam
                erat elit.
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
