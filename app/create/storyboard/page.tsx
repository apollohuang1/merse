"use client";

import CreateHeader from "@/components/create/create-header";
import React from "react";
import { FiEdit2, FiImage, FiList, FiType } from "react-icons/fi";
import { TbHeading } from "react-icons/tb";
import { createRoutes } from "../layout";

import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import DropCursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";

import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import { storyboardSamples } from "@/util/create-samples";

type Props = {};

const Storyboard = (props: Props) => {
  const [showAddingImageModal, setShowAddingImageModal] =
    React.useState<boolean>(false);
  const [addingImageURL, setAddingImageURL] = React.useState<string>("");

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
        placeholder: "Write your storyboard here...",
        emptyEditorClass: "is-editor-empty",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {},
      }),
      DropCursor.configure({
        color: "#10b981",
        width: 2,
        class: " rounded-full transition-all",
      }),
      Gapcursor,
    ],
    editorProps: {
      attributes: {
        class: "outline-none w-full h-full min-h-screen",
      },
    },
    // content: "<h1>Hello World! 🌎️</h1>",
  });

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* top of grid */}
        <CreateHeader currentRoute={createRoutes[2]} />

        {/* main content */}
        <div className="grid grid-cols-2 w-full h-[calc(100vh-100px)] px-4 gap-4">

          {/* prompt left panel */}
          <div
            className={clsx(
              "flex flex-col w-full h-full overflow-auto bg-light-background-secondary bg-opacity-30 dark:bg-opacity-70 dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider rounded-t-lg",
              editorStyles.editor
            )}
          >
            <div className="flex flex-row bg-light-background-secondary dark:bg-dark-background-secondary p-2 items-center justify-between border-b border-b-light-divider dark:border-b-dark-divider">

              {/* editor toolbar */}
              <div className="flex flex-row">
              </div>

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 h-8 rounded-full text-sm font-medium">
                Generate
              </button>

            </div>

            <div className="w-full h-full overflow-auto p-7">
              
              <EditorContent editor={editor} className={editorStyles.editor} />

              {editor && (
                <FloatingMenu
                  editor={editor}
                  tippyOptions={{ duration: 100 }}
                  className={clsx(
                    "flex flex-col bg-light-background-primary dark:bg-dark-background-primary rounded-lg border border-light-divider dark:border-dark-divider w-52 drop-shadow-xl translate-y-[calc(50%+16px)] -translate-x-3"
                  )}
                >
                  <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 rounded-t-lg focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        " text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("paragraph"),
                      }
                    )}
                  >
                    <FiType />
                    <span>Text</span>
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 rounded-t-lg focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        " text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("bulletList"),
                      }
                    )}
                  >
                    <FiList />
                    <span>Bulleted List</span>
                  </button>

                  <button
                    onClick={() => setShowAddingImageModal(true)}
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        " text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("image"),
                      }
                    )}
                  >
                    <FiImage />
                    <span>Image</span>
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        "text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("heading", { level: 1 }),
                      }
                    )}
                  >
                    <TbHeading />
                    <span>Heading 1</span>
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={clsx(
                      "flex flew-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        "text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("heading", { level: 2 }),
                      }
                    )}
                  >
                    <TbHeading />
                    <span>Heading 2</span>
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start rounded-b-lg outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        "text-emerald-500 bg-opacity-30 font-semibold":
                          editor.isActive("heading", { level: 3 }),
                      }
                    )}
                  >
                    <TbHeading />
                    <span>Heading 3</span>
                  </button>
                </FloatingMenu>
              )}
            </div>
          </div>

          {/* storyboard list right panel */}
          <div className="flex flex-col w-full h-full overflow-auto rounded-lg">
            <div className="grid grid-cols-2 max-md:flex max-md:flex-col w-full gap-4">
              {/* story card */}
              {storyboardSamples.map((style, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary rounded-lg border border-light-divider dark:border-dark-divider"
                >
                  {/* overlay  */}
                  {/* <div className="flex absolute w-full h-full items-center justify-center aspect-squar bg-black bg-opacity-30 dark:bg-opacity-30 opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-all rounded-lg cursor-pointer">
                    <FiEdit2 className="w-9 h-9 text-white" />
                  </div> */}

                  <img
                    src={style?.artwork?.url}
                    alt="comic book cover"
                    className="object-cover aspect-[4/3] rounded-t-lg"
                  />

                  {/* story line in storyboard */}
                  <div className="flex p-4">
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddingImageModal}
        onClose={() => setShowAddingImageModal(false)}
        title="Embed Image"
      >
        <div className="flex flex-col w-full h-full">
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
              className="flex flex-row w-full h-11 px-4 rounded-lg bg-transparent border border-light-divider dark:border-dark-divider focus:outline-emerald-500 focus:outline-1 outline-none transition-all text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
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
              className="flex flex-row h-10 w-20 rounded-full bg-emerald-500 border border-emerald-500 focus:outline-emerald-500 outline-none transition-all text-light-text-primary dark:text-dark-text-primary items-center justify-center"
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
