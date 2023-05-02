"use client";

import CreateHeader from "@/components/create/create-header";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  FiBold,
  FiCode,
  FiEdit2,
  FiImage,
  FiItalic,
  FiList,
} from "react-icons/fi";
import { BsQuote, BsSpotify } from "react-icons/bs";
import { IoText } from "react-icons/io5";

import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
  Editor,
  Node,
  mergeAttributes,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import Image from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

// ChakraUI
import { Spinner } from "@chakra-ui/react";

// import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import {
  StoryboardSample,
  createRoutes,
  storyboardSamples,
} from "@/util/create-constants";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  setContent,
  setScenes,
  setShowGeneratedStoryboard,
  setTitle,
} from "@/redux-store/store";
import useCreateEntry from "@/hooks/useCreateEntry";
import Blockquote from "@tiptap/extension-blockquote";
import { Scene } from "@/models/entry";
import Spotify from "@/tiptap/extensions/Spotify";


// Collaborative editing
import { HocuspocusProvider } from '@hocuspocus/provider';
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

const ydoc = new Y.Doc();
const provider = new WebrtcProvider("tiptap-collaboration-extension", ydoc);

type Props = {};

const Storyboard = (props: Props) => {
  // hooks
  const { generateStoryboard } = useCreateEntry();

  // redux states
  const auth = useAppSelector((state) => state.auth);
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const dispatch = useAppDispatch();

  const [showAddingImageModal, setShowAddingImageModal] =
    React.useState<boolean>(false);
  const [addingImageURL, setAddingImageURL] = React.useState<string>("");

  // Set up the Hocuspocus WebSocket provider
  const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: "example-document",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "text-light-text-primary dark:text-dark-text-primary",
          },
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Press tab or click to select a menu item...",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {},
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class:
            "bg-light-background-secondary dark:bg-dark-background-secondary rounded-none p-4 border-l-2 border-emerald-500",
        },
      }),
      HardBreak,
      Spotify,
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        // user: {
        //   name: 'Cyndi Lauper',
        //   color: '#f783ac',
        // },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "outline-none w-full h-full bg-transparent min-h-[calc(100vh-300px)] highlight selection:bg-[#3cc9a3] selection:bg-opacity-25",
      },
    },
  });

  editor?.on("update", (updatedEditor: any) => {
    const updatedContent = updatedEditor?.editor?.getHTML();
    dispatch(setContent(updatedContent));
  });

  editor?.on("create", (createdEditor: any) => {
    createdEditor?.editor.commands.setContent(entry?.content);
  });

  useEffect(() => {

    if (!editor) return;

    editor.commands.updateUser({
      name: auth?.currentUser?.name ?? "Anonymous",
      color: '#10b981',
      avatar: 'https://pbs.twimg.com/profile_images/1653106037262798848/xIwPY8Ws_400x400.jpg',
    })
  }, [editor])

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* navigation header */}
        <CreateHeader currentRoute={createRoutes[2]} entryId={entry?._id} />

        {/* main content (left and right panels columns) */}
        <div
          className={clsx(
            "flex flex-row w-full h-full overflow-hidden px-7",
            { "gap-0": !entryHelper.showGeneratedStoryboard },
            { "gap-7": entryHelper.showGeneratedStoryboard }
          )}
        >
          {/* left container */}
          <div className="flex flex-col w-full h-full items-center">
            {/* prompt left panel */}
            <div className="flex flex-col w-full h-[calc(100vh-100px)] max-w-3xl gap-6">
              {/* tools bar */}
              <div className="flex flex-row w-full items-center justify-between border-b border-b-light-divider dark:border-b-dark-divider pb-3">
                {entry?.scenes?.length > 0 ? (
                  <button
                    className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-30"
                    onClick={() => {
                      // setShowGeneratedStoryboard(!showGeneratedStoryboard);
                      dispatch(
                        setShowGeneratedStoryboard(
                          !entryHelper.showGeneratedStoryboard
                        )
                      );
                    }}
                  >
                    {entryHelper.showGeneratedStoryboard ? "Hide" : "Show"}
                  </button>
                ) : (
                  <div className="h-10"></div>
                )}

                {/* <button
                  className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-30"
                  onClick={() => {
                    embedSpotify();
                  }}
                >
                  Embed Spotify
                </button> */}

                {/* <button
                  className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-30"
                  onClick={() => {
                    try {
                      if (!editor) return
                      const html = editor.getHTML();
                      console.log(html)
                    } catch (error: any) {
                      console.log("Failed html, message: " + error.message)
                    }
                  }}
                >
                  Check html
                </button> */}

                <div className="flex flex-row gap-2">
                  <div className="flex flex-row gap-2 items-center h-8">
                    <button
                      className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-30"
                      onClick={() => {
                        // generateStoryboard(editor);
                        dispatch(setScenes(storyboardSamples));
                        dispatch(setShowGeneratedStoryboard(true));
                      }}
                    >
                      Puuung samples (test)
                    </button>
                  </div>

                  {entryHelper.isGeneratingStoryboard ? (
                    <div className="flex flex-row gap-2 items-center h-8">
                      <Spinner speed={"0.8s"} className="w-4 h-4" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  ) : (
                    <div className="flex flex-row gap-2 items-center h-8">
                      <button
                        className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-30"
                        onClick={() => {
                          generateStoryboard(editor);
                        }}
                      >
                        Generate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* title and editor */}
              <div className="flex flex-col w-full h-full overflow-auto">
                {/* title */}
                <input
                  type="text"
                  className="w-full py-5 bg-transparent outline-none text-6xl font-semibold text-[#0E100E] dark:text-[#E7FCE8] placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
                  value={entry?.title ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedTitle = e.target.value;
                    dispatch(setTitle(updatedTitle));
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    // press enter, shife focus to editor
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // push content down one block and focus on the first block
                      editor?.commands.focus("start");
                    }
                  }}
                  placeholder="Title"
                />

                <>
                  <EditorContent editor={editor} />

                  {editor && (
                    <FloatingMenu
                      editor={editor}
                      tippyOptions={{ duration: 100 }}
                      className={clsx(
                        "flex flex-col bg-light-background-primary dark:bg-dark-background-primary rounded-lg border border-light-divider dark:border-dark-divider w-52 drop-shadow-xl translate-y-[calc(50%+21px)] -translate-x-3"
                      )}
                    >
                      {floatingMenus.map((floatingMenu, index) => (
                        <button
                          key={index}
                          onClick={() => floatingMenu.onClick(editor)}
                          className={clsx(
                            "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
                            {
                              " text-accent bg-opacity-30 font-semibold":
                                floatingMenu.isActive(editor),
                            },
                            {
                              "rounded-t-lg": index === 0,
                            }
                          )}
                        >
                          {floatingMenu.icon}
                          <span>{floatingMenu.label}</span>
                        </button>
                      ))}

                      <button
                        onClick={() => setShowAddingImageModal(true)}
                        className={clsx(
                          "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary rounded-b-lg",
                          {
                            "text-accent bg-opacity-30 font-semibold":
                              editor.isActive("image"),
                          }
                        )}
                      >
                        <FiImage />
                        <span>Image</span>
                      </button>
                    </FloatingMenu>
                  )}

                  {editor && (
                    <BubbleMenu
                      editor={editor}
                      tippyOptions={{ duration: 100 }}
                      className="flex flex-row bg-light-background-primary dark:bg-dark-background-primary drop-shadow-2xl border border-light-divider dark:border-dark-divider h-8"
                    >
                      {bubbleMenus.map((bubbleMenu: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => bubbleMenu.onClick(editor)}
                          className={clsx(
                            "flex flex-row items-center justify-start outline-none gap-2 px-2 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary",
                            {
                              " text-accent bg-opacity-30":
                                bubbleMenu?.isActive(editor),
                            }
                          )}
                        >
                          {bubbleMenu.icon}
                        </button>
                      ))}
                    </BubbleMenu>
                  )}
                </>
              </div>
            </div>
          </div>

          {/* right panel */}
          <div
            className={clsx(
              "flex flex-col h-full items-center duration-300 overflow-auto gap-4 flex-shrink-0",
              { "w-0 opacity-0": !entryHelper.showGeneratedStoryboard },
              { "w-[400px]": entryHelper.showGeneratedStoryboard }
            )}
          >
            <div className="flex flex-col w-full gap-4 max-xl:flex max-xl:flex-col">
              {entry?.scenes.map(
                (scene: Scene & StoryboardSample, index: number) => (
                  <div
                    key={index}
                    className="group relative flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider aspect-auto min-w-[400px]"
                  >
                    {/* overlay  */}
                    {/* <div className="flex absolute w-full h-full items-center justify-center aspect-squar bg-black bg-opacity-30 dark:bg-opacity-30 opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-all rounded-lg cursor-pointer">
                    <FiEdit2 className="w-9 h-9 text-white" />
                  </div> */}

                    <img
                      src={
                        scene?.image_base64
                          ? "data:image/png;base64," + scene.image_base64
                          : scene.artwork.url
                      }
                      alt="comic book cover"
                      className="object-cover aspect-[4/3]"
                    />

                    {/* story line in storyboard */}
                    <div className="flex p-4">
                      <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[8]">
                        {scene.text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddingImageModal}
        onClose={() => setShowAddingImageModal(false)}
        withCloseButton={false}
        title="Embed Image"
      >
        <div className="flex flex-col w-full h-full px-3 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editor) {
                editor.chain().focus().setImage({ src: addingImageURL }).run();
              }
              setShowAddingImageModal(false);
              setAddingImageURL("");
            }}
          >
            <input
              type="text"
              value={addingImageURL}
              placeholder="Paste the image link..."
              onChange={(e) => setAddingImageURL(e.target.value)}
              className="flex flex-row w-full h-11 px-4 rounded-lg bg-transparent border border-light-divider dark:border-dark-divider focus:outline-accent focus:outline-1 outline-none transition-all text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
            />
          </form>

          {/* cancel and add buttons on the right hand side */}
          <div className="flex flex-row w-full h-12 gap-2 mt-4 justify-end">
            <button
              onClick={() => {
                setShowAddingImageModal(false);
              }}
              className="flex flex-row h-10 w-20 rounded-full outline-none transition-all text-light-text-primary dark:text-dark-text-primary items-center justify-center"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (editor) {
                  // editor.chain().focus().setImage({ src: "https://i.ytimg.com/vi/U1VcEgS0XkQ/maxresdefault.jpg" }).run()
                  editor
                    .chain()
                    .focus()
                    .setImage({ src: addingImageURL })
                    .run();
                }
                setShowAddingImageModal(false);
              }}
              className="flex flex-row h-10 w-20 rounded-full bg-accent border border-accent focus:outline-accent outline-none transition-all text-light-text-primary dark:text-dark-text-primary items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Storyboard;

const bubbleMenus = [
  {
    type: "paragraph",
    label: "Text",
    icon: <IoText />,
    onClick: (editor: Editor) => editor?.chain().focus().setParagraph().run(),
    isActive: (editor: Editor) => editor?.isActive("paragraph"),
  },
  {
    type: "heading1",
    label: "Heading 1",
    icon: "H1",
    onClick: (editor: Editor) =>
      editor?.chain().focus().setHeading({ level: 1 }).run(),
    isActive: (editor: Editor) => editor?.isActive("heading", { level: 1 }),
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: "H2",
    onClick: (editor: Editor) =>
      editor?.chain().focus().setHeading({ level: 2 }).run(),
    isActive: (editor: Editor) => editor?.isActive("heading", { level: 2 }),
  },
  {
    type: "heading3",
    label: "Heading 3",
    icon: "H3",
    onClick: (editor: Editor) =>
      editor?.chain().focus().setHeading({ level: 3 }).run(),
    isActive: (editor: Editor) => editor?.isActive("heading", { level: 3 }),
  },
  {
    type: "bold",
    label: "Bold",
    icon: <FiBold />,
    onClick: (editor: Editor) => editor?.chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor?.isActive("bold"),
  },
  {
    type: "italic",
    label: "Italic",
    icon: <FiItalic />,
    onClick: (editor: Editor) => editor?.chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor?.isActive("italic"),
  },
  // {
  //   type: "underline",
  //   icon: "Strike",
  //   onClick: () => editor?.chain().focus().toggleStrike().run(),
  //   isActive: editor?.isActive("strike"),
  // },
  {
    type: "bulletList",
    label: "Bullet List",
    icon: <FiList />,
    onClick: (editor: Editor) =>
      editor?.chain().focus().toggleBulletList().run(),
    isActive: (editor: Editor) => editor?.isActive("bulletList"),
  },
  {
    type: "codeBlock",
    label: "Code Block",
    icon: <FiCode />,
    onClick: (editor: Editor) =>
      editor?.chain().focus().toggleCodeBlock().run(),
    isActive: (editor: Editor) => editor?.isActive("codeBlock"),
  },
  {
    type: "blockquote",
    label: "Blockquote",
    icon: <BsQuote />,
    onClick: (editor: Editor) =>
      editor?.chain().focus().toggleBlockquote().run(),
    isActive: (editor: Editor) => editor?.isActive("blockquote"),
  },
  {
    type: "spotify",
    label: "Spotify",
    icon: <BsSpotify />,
    onClick: (editor: Editor) => {
      // window prompt to fill spotify embed url
      const inputSpotifyLink = window.prompt("Enter Spotify Embed URL");

      if (!inputSpotifyLink) {
        return;
      }

      const spotifyLinkRegex =
        /^https:\/\/open\.spotify\.com\/(playlist|track)\/[a-zA-Z0-9?=._-]+$/;

      if (spotifyLinkRegex.test(inputSpotifyLink)) {
        const embedLink = inputSpotifyLink
          .replace("open.spotify.com", "open.spotify.com/embed")
          .replace("?", "?utm_source=generator&");
        // @ts-ignore
        editor?.commands.setSpotifyPlaylist({ src: embedLink });
      } else {
        alert("Invalid Spotify Embed URL");
      }
    },
    isActive: (editor: Editor) => editor?.isActive("spotify"),
  },
];

const floatingMenus = bubbleMenus.filter((menu) => {
  return menu.type !== "bold" && menu.type !== "italic";
});