"use client";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setContent, setEntry } from "@/redux-store/store";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const CreateEntryIdPage = (props: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const entry = useAppSelector((state) => state.entry);

  useEffect(() => {
    // fetch entry data
    if (!pathname) return;
    const entryId = pathname.split("/")[2];
    fetchEntryData(entryId);
  }, [pathname]);

  const fetchEntryData = async (entryId: string) => {
    try {
      const response = await axios({
        method: "GET",
        url: `/api/entries/${entryId}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });

      dispatch(setEntry(response.data));
      router.push(location.pathname + "/styles");
    } catch (error: any) {
      console.log("Failed to fetch entry data, message: ", error.message);
    }
  };

  return (
    <div className="flex flex-cols w-full h-full items-center justify-center">
      <Spinner className="w-6 h-6" />
    </div>
  );
};

export default CreateEntryIdPage;
