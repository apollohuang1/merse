"use client";

import CreateHeader from "@/components/create/create-header";
import React, { FormEventHandler, useState } from "react";
import {
  FiBold,
  FiCode,
  FiEdit2,
  FiImage,
  FiItalic,
  FiList,
} from "react-icons/fi";
import { BsQuote } from "react-icons/bs";
import { IoText } from "react-icons/io5";

import {
  useEditor,
  EditorContent,
  FloatingMenu,
  JSONContent,
  BubbleMenu,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

// ChakraUI
import { Spinner } from "@chakra-ui/react";

// import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import { StoryboardSample, createRoutes, storyboardSamples } from "@/util/create-constants";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  setContent,
  setShowGeneratedStoryboard,
  setTitle,
} from "@/redux-store/store";
import useCreateEntry from "@/hooks/useCreateEntry";
import Blockquote from "@tiptap/extension-blockquote";
import { Scene } from "@/models/entry";

type Props = {
  diaryTexts: string[];
};

const LayoutPage = (props: Props) => {
  // redux states
  const { diaryTexts } = props;
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const dispatch = useAppDispatch();

  const [showAddingImageModal, setShowAddingImageModal] =
    React.useState<boolean>(false);
  const [addingImageURL, setAddingImageURL] = React.useState<string>("");
  const [expandedStoryboardIndex, setExpandedStoryboardIndex] = React.useState<
    number | null
  >(null);

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
    ],
    editorProps: {
      attributes: {
        class:
          "outline-none w-full h-full bg-transparent min-h-[calc(100vh-300px)] highlight selection:bg-[#3cc9a3] selection:bg-opacity-25",
      },
    },
  });

  editor?.on("update", (updatedEditor: any) => {
    const updatedContent = updatedEditor?.editor?.getJSON();
    dispatch(setContent(updatedContent));
  });

  editor?.on("create", (createdEditor: any) => {
    createdEditor?.editor.commands.setContent(entry?.content);
  });

  const createFadeTopStyle = (): React.CSSProperties => {
    return {
      backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))`,
      backgroundSize: "100% 25%",
      backgroundRepeat: "no-repeat",
    };
  };

  const handleToggleStoryboard = (index: number) => {
    setExpandedStoryboardIndex(
      expandedStoryboardIndex === index ? null : index
    );
  };

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* navigation header */}
        <CreateHeader currentRoute={createRoutes[3]} />

        {/* main content (left and right panels columns) */}
        <div
          className={clsx(
            "flex flex-col h-full items-center duration-300 overflow-auto gap-4 flex-shrink-0",
            { "w-0 opacity-0": !entryHelper.showGeneratedStoryboard },
            { "w-[400px]": entryHelper.showGeneratedStoryboard }
          )}
        >
          {/* right panel */}
          <div
            className={clsx(
              "flex flex-col h-full items-center duration-300 overflow-auto gap-4 flex-shrink-0",
              { "w-0 opacity-0": !entryHelper.showGeneratedStoryboard },
              { "w-[400px]": entryHelper.showGeneratedStoryboard }
            )}
          >
            <div className="flex flex-col w-full h-full justify-start">
              <div className="flex flex-col w-full gap-4 items-center">
              {entry?.scenes.map((scene: Scene & StoryboardSample, index: number) => (
                <div key={index} className="w-full flex flex-col gap-4">
                  {/* Display the diary text */}
                  <div className="w-full text-center p-2">
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      {diaryTexts[index]}
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <div
                      className="group relative flex flex-col w-full max-w-[400px] mx-auto bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider aspect-auto mb-4 fade-top cursor-pointer"
                      onClick={() => handleToggleStoryboard(index)}
                    >
                      <img
                        src={scene?.image_base64 ? ("data:image/png;base64," + scene.image_base64) : scene.artwork.url}
                        alt="comic book cover"
                        className="object-cover aspect-[4/3] relative fade-top"
                        style={createFadeTopStyle()}
                      />

                      {/* story line in storyboard */}
                      {expandedStoryboardIndex === index && (
                        <div className="flex p-4">
                          <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[8]">
                            {scene.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-top::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 25%;
          background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0)
          );
          z-index: 1;
        }
      `}</style>

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

export default LayoutPage;
