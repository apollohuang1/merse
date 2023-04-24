"use client";

import axios from "axios";
import React, { useEffect, useMemo } from "react";

import { useSearchParams } from "next/navigation";
import { JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import parse from "html-react-parser";
import { Entry } from "@/models/entry";
import Spotify from "@/tiptap/extensions/Spotify";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";

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
      setEntryData(response.data);
    } catch (error: any) {
      console.log("Failed to fetch entry, message: ", error.message);
    }
  };

  const output = useMemo(() => {
    if (!entryData?.content) return null;
    // const generatedHTML = generateHTML(entryData.content, [StarterKit, Image, HardBreak, Spotify]);
    // return generatedHTML;
    return parse(entryData.content);
  }, [entryData]);

  return (
    <div className="flex flex-col w-full h-full items-center p-6">
      <div className="flex flex-col w-full h-full items-center max-w-3xl gap-6">

        {output && (
          <div className="flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary p-8 rounded-xl gap-4">
            <h1 className="text-4xl font-bold">{entryData?.title}</h1>
            <div className="w-full h-[1px] border-t border-light-divider dark:border-dark-divider" />
            {output}
          </div>
        )}

        {/* { entryData?.spotify_playlist_id &&
          <iframe
            // style="border-radius:12px"
            className="rounded-xl w-full h-[352px] min-h-[352px]"
            src={`https://open.spotify.com/embed/playlist/${entryData.spotify_playlist_id}?utm_source=generator`}
            // width="100%"
            // height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        } */}

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
