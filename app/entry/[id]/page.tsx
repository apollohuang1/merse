"use client";

import axios from "axios";
import React, { Fragment, useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import clsx from "clsx";

import * as fabric from "fabric";
import { Spinner } from "@chakra-ui/react";
import Divider from "@/components/divider";
import { Menu, Transition } from "@headlessui/react";
import SlideOver from "@/components/slide-over";
import { useReadEntry } from "@/hooks/useReadEntry";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { ObjectId } from "mongoose";
import Link from "next/link";
import { setEntry, setNotificationContent } from "@/redux-store/store";

type Props = {};

const ReadPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { likeEntry, addComment } = useReadEntry();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // states
  const [entryData, setEntryData] = React.useState<Entry | null>(null);
  const [showCommentSection, setShowCommentSection] =
    React.useState<boolean>(false);

  // comments
  const [commentText, setCommentText] = React.useState<string>("");
  const [isSendingComment, setIsSendingComment] =
    React.useState<boolean>(false);

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

      if (!entryId) {
        throw new Error("Failed to get entry id");
      }

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
      console.log("Failed to fetch entry, message: ", error);
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

    console.log("rendering...")
    console.log(canvasJSON)

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

    setFabricCanvas(canvas);

    canvas.backgroundColor = "transparent";

    canvas
      .loadFromJSON(canvasJSON, (o, object) => {
        object.selectable = false;
      })
      .then(() => {
        canvas.requestRenderAll();
        console.log("rendered");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const isLikedByCurrentUser = () => {
    return entryData?.likes?.includes(auth?.currentUser?._id);
  };

  const handleLikeEntry = async () => {
    try {
      // guards
      if (!entryData?._id || !auth?.currentUser?._id) return;

      const updatedLikes = await likeEntry(
        auth?.currentUser?._id,
        entryData?._id,
        isLikedByCurrentUser() ? "unlike" : "like"
      );

      if (!updatedLikes) throw new Error("No updated likes array returned");

      setEntryData({
        ...entryData,
        likes: updatedLikes,
      });
    } catch (error: any) {
      console.log("Failed to like entry, message: ", error.message);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!entryData?._id || !auth?.currentUser?._id) return;
      setIsSendingComment(true);

      const newComments = await addComment(
        auth?.currentUser?._id,
        entryData?._id,
        commentText
      );

      setEntryData({
        ...entryData,
        comments: newComments,
      });

      setCommentText("");
      setIsSendingComment(false);

      setTimeout(() => {
        // smooth scroll to bottom in document id comments-slide-over
        const commentsSection = document.getElementById("comments-slide-over");
        commentsSection?.scrollTo({
          top: commentsSection.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    } catch (error: any) {
      setIsSendingComment(false);
      console.log("Failed to add comment to entry, message: ", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full items-center overflow-auto">
        {entryData ? (
          <div className="flex flex-col w-full h-auto items-center max-w-3xl gap-14 pt-6 pb-64">

            <div className="flex flex-col w-full gap-14 max-xl:px-6">
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

                  <div className="flex flex-row gap-2 flex-shrink-0 items-center">
                    <button
                      onClick={() => setShowCommentSection(!showCommentSection)}
                      className="group flex flex-row gap-2 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary items-center px-2 rounded-lg"
                    >
                      <FiMessageCircle className="w-6 h-6 text-light-text-tertiary dark:text-dark-text-tertiary" />
                      <span className="line-clamp-1 font-medium">
                        {entryData?.comments?.length ?? 0}
                      </span>
                    </button>

                    <button
                      onClick={handleLikeEntry}
                      className="flex flex-row gap-2 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary items-center px-2 rounded-lg"
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
                      <span className="line-clamp-1 font-medium">
                        {entryData?.likes?.length ?? 0}
                      </span>
                    </button>

                    <Menu as="div" className="relative inline-block text-left">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button
                              className={clsx(
                                "group flex w-8 h-8 hover:bg-emerald-500 hover:bg-opacity-10 items-center justify-center rounded-full",
                                {
                                  "bg-emerald-500 bg-opacity-10": open,
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
                            <Menu.Items className="absolute top-[calc(100%+5px)] z-10 w-44 origin-top-right divide-y divide-light-divider dark:divide-dark-divider rounded-md bg-light-background-primary dark:bg-dark-background-secondary focus:outline-none ring-1 ring-light-divider dark:ring-dark-divider drop-shadow-lg">
                              <div className="py-1">

                                { entryData?.author?._id === auth?.currentUser?._id &&
                                  <>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                        onClick={() => {
                                          router.push(`/create/${entryData?._id}`)
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
                                                url: `/api/entries?id=${entryData?._id}`,
                                                headers: {
                                                  "Authorization": `Bearer ${process.env.MERSE_API_KEY}`,
                                                }
                                              })
                                              .then((res) => {
                                                router.push("/");
                                              })
                                              .catch((err) => {
                                                alert("Something went wrong. Please try again later.");
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
                                }

                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          window.location.href
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
              )}

              {output && (
                // <div className="flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary p-8 rounded-xl gap-4">
                <div className="flex flex-col w-full rounded-xl gap-5">
                  <h1 className="text-4xl font-semibold leading-tight">
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
            </div>

            {/* fabric canvas */}
            {entryData?.canvas && (

              <img
                src={entryData?.canvas}
                alt="canvas"
                className="w-full object-contain"
              />

              // <canvas id="canvas" />

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
        withPadding={false}
      >
        <div className="sticky top-0 flex flex-row gap-3 px-6 py-3 bg-light-background-secondary dark:bg-dark-background-secondary focus-within:bg-light-background-primary dark:focus-within:bg-dark-background-primary transition-all border-b border-light-divider dark:border-dark-divider">
          <img
            src={auth?.currentUser?.profile_image_url}
            className="w-11 h-11 rounded-full object-cover"
          />

          {/* add comment input */}
          <div className="flex flex-row items-center gap-3 w-full border-light-divider dark:border-dark-divider rounded-none overflow-clip">
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

            {isSendingComment && (
              <Spinner className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0 px-6">
          {entryData?.comments?.map((comment: Comment, index: number) => (
            <div
              key={index}
              className="flex flex-row gap-3 w-full border-light-divider dark:border-dark-divider py-5 items-start"
            >
              {/* image */}
              <button
                onClick={() => {
                  router.push(
                    `/${comment?.author?.username || comment?.author?._id}`
                  );
                }}
                className="flex-shrink-0"
              >
                <img
                  src={comment?.author?.profile_image_url}
                  className="w-11 h-11 rounded-full object-cover"
                />
              </button>

              <div className="flex flex-col items-start gap-[3px]">
                <Link
                  href={`/${comment?.author?.username || comment?.author?._id}`}
                  className="font-semibold leading-none hover:underline"
                >
                  {/* if username exsits use it. if not, use name */}
                  {comment?.author?.username ||
                    comment?.author?.name ||
                    "Unknown"}
                </Link>
                <span className="text-base leading-snug">
                  {comment?.content}
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
