"use client";

import axios from "axios";
import React, { useEffect, useMemo } from "react";

import { useSearchParams } from "next/navigation";
import { JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import parse from "html-react-parser";
import { Entry } from "@/models/entry";

type Props = {};

const ReadPage = (props: Props) => {
  const searchParams = useSearchParams();

  // states
  const [entryData, setEntryData] = React.useState<Entry | null>(null);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const id = searchParams?.get("id");

      const response = await axios<Entry>({
        method: "GET",
        url: `/api/entries?id=${id}`,
      });

      console.log(response.data);
      setEntryData(response.data);
    } catch (error: any) {
      console.log("Failed to fetch entry, message: ", error.message);
    }
  };

  const output = useMemo(() => {
    if (!entryData?.content) return null;
    return generateHTML(entryData.content, [StarterKit]);
  }, [entryData]);

  return (
    <div className="flex flex-col w-full h-full items-center p-6">
      <div className="flex flex-col w-full h-full items-center max-w-3xl gap-6">
        
        {output && (
          <div className="bg-light-background-secondary dark:bg-dark-background-secondary p-6 rounded-xl">
            <div className="text-left">{parse(output)}</div>
          </div>
        )}

        {entryData?.scenes?.map((scene, index) => {
          return (
            <div key={index} className="flex flex-col items-center w-full">
              <img
                // base64 image url source
                src={"data:image/png;base64," + scene.image_base64}
                alt="scene"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadPage;
