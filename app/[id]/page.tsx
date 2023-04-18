"use client";

import { Entry } from "@/models/entry";
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
    <div className="flex flex-col w-full h-full">
      {allEntries.map((entry: Entry, index: number) => (
        <button
          key={index}
          onClick={() => {
            router.push(`/read?id=${entry._id}`);
          }}
          className="flex flex-row w-full h-16 items-center justify-between px-6 border-t border-t-light-divider dark:border-dark-divider hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
        >
          <span>{entry.title}</span>
          <FiChevronRight className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
      ))}
    </div>
  );
};

export default ProfilePage;
