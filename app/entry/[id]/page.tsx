"use client";

import axios from "axios";
import React, { Fragment, useEffect, useMemo } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import parse from "html-react-parser";
import { Comment, Entry } from "@/models/entry";
import Spotify from "@/tiptap/extensions/Spotify";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";
import {
  getFormattedDateFromMongoDBDate,
  getLastIdFromUrl,
} from "@/util/helper";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import clsx from "clsx";

import * as fabric from "fabric";
import { Spinner } from "@chakra-ui/react";
import Divider from "@/components/divider";
import { Transition } from "@headlessui/react";
import SlideOver from "@/components/slide-over";
import { useReadEntry } from "@/hooks/useReadEntry";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { ObjectId } from "mongoose";

type Props = {};

const ReadPage = (props: Props) => {

  const searchParams = useSearchParams();
  const { likeEntry, addComment } = useReadEntry();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // states
  const [entryData, setEntryData] = React.useState<Entry | null>(null);
  const [showCommentSection, setShowCommentSection] = React.useState<boolean>(false);

  // comments
  const [commentText, setCommentText] = React.useState<string>("");
  const [isSendingComment, setIsSendingComment] = React.useState<boolean>(false);

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

      const response = await axios({
        method: "GET",
        url: `/api/entries?id=${entryId}`,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });
      setEntryData(response.data);
      renderCanvas(response.data.canvas);
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

  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas | null>(
    null
  );

  const renderCanvas = (canvasJSON: object) => {
    // render fabric canvas

    window.addEventListener("resize", () => {
      canvas.setDimensions({
        width: innerWidth - 250,
        height: innerHeight,
      });
    });

    const canvas = new fabric.Canvas("canvas");

    canvas.setDimensions({
      width: innerWidth - 250,
      height: innerHeight,
    });

    canvas.backgroundColor = "#ffffff";

    setFabricCanvas(canvas);

    canvas
      .loadFromJSON(canvasJSON, (o, object) => {
        object.selectable = false;
      })
      .then(() => {
        // console.log("Canvas loaded successfully");
        // console.log("canvas: ", canvas);
        canvas.requestRenderAll();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const isLikedByCurrentUser = () => {
    return entryData?.likes?.includes(auth?.currentUser?._id);
  }


  const handleLikeEntry = async () => {
    try {
      // guards
      if (!entryData?._id || !auth?.currentUser?._id) return;

      const updatedLikes = await likeEntry(auth?.currentUser?._id, entryData?._id, isLikedByCurrentUser() ? "unlike" : "like");

      if (!updatedLikes) throw new Error("No updated likes array returned");

      setEntryData({
        ...entryData,
        likes: updatedLikes,
      });
  
    } catch (error: any) {
      console.log("Failed to like entry, message: ", error.message);
    }
  }

  const handleAddComment = async () => {
    try {

      if (!entryData?._id || !auth?.currentUser?._id) return;
      setIsSendingComment(true);

      const newComments = await addComment(auth?.currentUser?._id, entryData?._id, commentText);

      setEntryData({
        ...entryData,
        comments: newComments,
      });

      setCommentText("");
      setIsSendingComment(false);

    } catch (error: any) {
      setIsSendingComment(false);
      console.log("Failed to add comment to entry, message: ", error.message);
    }
  }


  return (
    <>
      <div className="flex flex-col w-full h-full items-center overflow-auto">
        {entryData ? (
          <div className="flex flex-col w-full h-auto items-center max-w-3xl gap-12 pb-64 px-6 pt-6">
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

                <div className="flex flex-row gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowCommentSection(!showCommentSection)}
                    className="group flex flex-row gap-2 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary items-center px-3 rounded-lg"
                  >
                    <FiMessageCircle className="w-6 h-6 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    <span className="line-clamp-1 font-medium">{entryData?.comments?.length ?? 0}</span>
                  </button>

                  <button
                    onClick={handleLikeEntry}
                    className="flex flex-row gap-2 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary items-center px-3 rounded-lg"
                  >
                    <FiHeart
                      className={clsx(
                        "w-6 h-6 transition-all hover:scale-105 active:scale-100",
                        {
                          "text-light-text-tertiary dark:text-dark-text-tertiary fill-transparent":
                            isLikedByCurrentUser() == false,
                        },
                        {
                          "fill-light-red dark:fill-dark-red text-light-red dark:text-dark-red":
                            isLikedByCurrentUser(),
                        }
                      )}
                    />
                    <span className="line-clamp-1 font-medium">{entryData?.likes?.length ?? 0}</span>
                  </button>
                </div>
              </div>
            )}

            {output && (
              // <div className="flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary p-8 rounded-xl gap-4">
              <div className="flex flex-col w-full rounded-xl gap-5">
                <h1 className="text-5xl font-semibold leading-tight">
                  {entryData?.title}
                </h1>
                {/* <div className="w-full h-[1px] border-t border-light-divider dark:border-dark-divider" /> */}
                <Divider />
                {output}
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

            {/* fabric canvas */}
            {entryData?.canvas && (
              <canvas
                id="canvas"
                className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary"
              />

              // <div
              //   id="canvas-parent"
              //   className="flex flex-col items-center w-96 h-full overflow-auto"
              // >
              //   <canvas
              //     id="canvas"
              //     className="w-full h-full"
              //     style={{ border: "1px solid #ccc" }}
              //   ></canvas>
              // </div>
            )}
          </div>
        ) : (
          <div className="flex flex-row w-full h-full items-center justify-center">
            <Spinner className="w-7 h-7 text-light-text-tertiary dark:text-dark-text-tertiary" />
          </div>
        )}
      </div>

      <SlideOver
        size="md"
        title={`${entryData?.comments?.length} Comments`}
        isOpen={showCommentSection}
        onClose={() => {
          setShowCommentSection(false);
        }}
        withCloseButton
      >

        <div className="flex flex-row gap-3 pb-4">

          <img
            src={auth?.currentUser?.profile_image_url}
            className="w-12 h-12 rounded-full object-cover"
          />

          {/* add comment input */}
          <div className="flex flex-row items-center px-5 gap-2 w-full bg-light-background-secondary dark:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider rounded-full overflow-clip">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              // className="w-full h-12 px-4 py-2 rounded-full bg-light-background-tertiary dark:bg-dark-background-tertiary focus:outline-none"
              className="w-full outline-none placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary bg-transparent"
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
            />

            { isSendingComment &&
              <Spinner className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            }

          </div>
        </div>

        <div className="flex flex-col gap-0">
          {entryData?.comments?.map((comment: Comment, index: number) => (
            <div key={index} className="flex flex-row gap-3 w-full border-b border-light-divider dark:border-dark-divider py-6">
              {/* image */}
              <img
                src="https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex flex-col">
                <span className="font-semibold leading-tight">Test Name</span>
                <span className="text-base leading-tight">
                  { comment?.content }
                </span>
              </div>
            </div>
          ))}
        </div>
      </SlideOver>
    </>
  );
};

export default ReadPage;
