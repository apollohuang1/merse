"use client";

import axios from "axios";
import React, { useEffect, useMemo } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import parse from "html-react-parser";
import { Entry } from "@/models/entry";
import Spotify from "@/tiptap/extensions/Spotify";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";
import {
  getFormattedDateFromMongoDBDate,
  getLastIdFromUrl,
} from "@/util/helper";
import { FiHeart } from "react-icons/fi";
import clsx from "clsx";

import * as fabric from "fabric";
import { puuungCanvasTemplate3 } from "@/util/create-constants";

type Props = {};

const ReadPage = (props: Props) => {
  const searchParams = useSearchParams();

  // states
  const [entryData, setEntryData] = React.useState<Entry | null>(null);
  const [isLiked, setIsLiked] = React.useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    fetchEntry();
  }, []);


  const fetchEntry = async () => {
    try {
      if (!pathname) {
        throw new Error("Failed to get pathname");
      }

      const entryId = pathname.split("/")[2];

      console.log("entryId: ", entryId);
      const response = await axios({
        method: "GET",
        url: `/api/entries?id=${entryId}`,
        headers: {
          "Authorization" : `Bearer ${process.env.MERSE_API_KEY}`
        },
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

  useEffect(() => {
    // render fabric canvas

    console.log(document.getElementById("canvas-parent")?.clientWidth as number)

    window.addEventListener("resize", () => {
      console.log("resized width and height to: ", innerWidth, innerHeight);
      canvas.setDimensions({
        width: innerWidth - 250,
        height: innerHeight,
      });
    });

    const canvas = new fabric.Canvas("canvas", {
      backgroundColor: "#ffffff",
    });

    canvas.loadFromJSON(puuungCanvasTemplate3, (o, object) => {
      canvas.renderAll();
      object.selectable=false;
    });

  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center p-6">
      <div className="flex flex-col w-full h-full items-center max-w-3xl gap-6">
        {/* author profile */}

        {entryData?.author && (
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row gap-4 w-full justify-start">
              <img
                src={entryData?.author?.profile_image_url}
                alt="author profile image"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="font-medium">
                  {entryData?.author?.name as string}
                </span>
                <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">{`Created at ${getFormattedDateFromMongoDBDate(
                  entryData?.created_at
                )}`}</span>
              </div>
            </div>

            <button
              onClick={() => {
                console.log("clicked");
                setIsLiked(!isLiked);
              }}
            >
              <FiHeart
                className={clsx(
                  "w-6 h-6 transition-all hover:scale-105 active:scale-100",
                  { "text-light-text-secondary dark:text-dark-text-secondary fill-transparent": !isLiked },
                  { "fill-light-red dark:fill-dark-red text-light-red dark:text-dark-red": isLiked }
                )}
              />
            </button>
          </div>
        )}

        {output && (
          // <div className="flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary p-8 rounded-xl gap-4">
          <div className="flex flex-col w-full rounded-xl gap-4">
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

        {/* fabric canvas */}
        <div 
          id="canvas-parent"
          className="flex flex-col items-center w-96 h-full overflow-auto"
        >
          <canvas
            id="canvas"
            className="w-full h-full"
            style={{ border: "1px solid #ccc" }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
