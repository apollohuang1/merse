"use client";

import CreateHeader from "@/components/create/create-header";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FiBold,
  FiCode,
  FiEdit2,
  FiImage,
  FiItalic,
  FiList,
  FiMessageCircle,
  FiMessageSquare,
} from "react-icons/fi";

import { BiText } from "react-icons/bi";

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
import { Spinner, calc } from "@chakra-ui/react";

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
  setCanvas,
  setContent,
  setShowGeneratedStoryboard,
  setTitle,
} from "@/redux-store/store";
import useCreateEntry from "@/hooks/useCreateEntry";
import Blockquote from "@tiptap/extension-blockquote";
import { Scene } from "@/models/entry";

import * as fabric from "fabric";
import { Canvas } from "@/components/canvas";

type Props = {};

const LayoutPage = (props: Props) => {
  // redux states
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

  const canvasEl = React.useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [clipboard, setClipboard] = useState(null);
  const [currentActiveObject, setCurrentActiveObject] = useState<any | null>(
    null
  );
  const [currentActiveObjectType, setCurrentActiveObjectType] = useState<
    string | null
  >(null);

  useEffect(() => {

  }, [])

  useEffect(() => {

    const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement);

    const isDarkMode = localStorage.getItem("theme") === "dark";

    // load json if exist in entry?.canvas
    if (entry?.canvas) {
      canvas.loadFromJSON(entry?.canvas, () => {
        canvas.renderAll();
      });
    }

    // const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement);
    // make the fabric.Canvas instance available to your app
    setFabricCanvas(canvas);

    // snap to grid
    canvas.on("object:moving", function (options) {
      // check if object is image
      if (options.target.get("type") !== "image" && options.target.get("type") !== "activeselection") {
        return;
      }

      options.target.set({
        left: Math.round(options.target.left / gridSize) * gridSize,
        top: Math.round(options.target.top / gridSize) * gridSize,
      });
    });

    canvas.setDimensions({
      width: innerWidth - 250,
      height: innerHeight * 4,
    });

    // stylings

    // customize selection style
    canvas.selectionColor = "rgba(0,0,0,0.3)";

    // detect dark mode class and set background color
    if (isDarkMode) {
      canvas.backgroundColor = "#161816";
    } else {
      canvas.backgroundColor = "#F5F5F7";
    }

    // const gridSize = 32;
    const gridSize = 20;

    // for (let i = 0; i < canvas.width; i += gridSize) {
    //   for (let j = 0; j < canvas.height; j += gridSize) {
    //     const circle = new fabric.Circle({
    //       left: i,
    //       top: j,
    //       radius: 1.5,
    //       fill: isDarkMode ? "#ffffff" : "#000000",
    //       opacity: 0.1,
    //       selectable: false,
    //       evented: false
    //     });
    //     canvas.add(circle);
    //   }
    // }

    // observers

    canvas.on("selection:created", function (options) {
      // @ts-ignore
      setCurrentActiveObject(options.selected);
      setCurrentActiveObjectType(canvas.getActiveObject()?.get("type"));

      // console.log(options.selected);
      // console.log(canvas.getActiveObject()?.get("type"));
    });

    canvas.on("selection:cleared", function (options) {
      setCurrentActiveObject(null);
      setCurrentActiveObjectType(null);
    });

    // snap when resizing
    canvas.on("object:scaling", function (options) {
      // check if object is image
      console.log(options.target.getScaledWidth());

      // only scale with gridSize
      // if (options.target.get("type") !== "image") {
        // return;
      // }
    });

    return () => {
      setFabricCanvas(null);
      canvas.dispose();
    };
  }, []); // end on canvas init

  const addImageURLToCanvas = (url: string) => {
    fabric.Image.fromURL(url)
      .then((img) => {
        fabricCanvas?.add(img);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addComicBubbleToCanvas = () => {
    const ovalPathString = "M 0 0 C 0 -90 210 -90 210 0 C 210 90 0 90 0 0 Z";

    const bubblePath = new fabric.Path(ovalPathString, {
      // left: fabricCanvas?.width as number / 2,
      // top: fabricCanvas?.height as number / 2,
      left: 150,
      top: 150,
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      width: 1000,
      height: 1000,
    });
    const bubbleText = new fabric.Textbox("Add comic dialogue", {
      left: bubblePath.left,
      top: bubblePath.top,
      fill: "#000",
      fontSize: 24,
      width: bubblePath.width / 2,
      height: bubblePath.height / 2,
      textAlign: "center",
      originX: "center",
      originY: "center",
    });

    // add as a group
    // const bubbleGroup = new fabric.Group([bubblePath, bubbleText]);
    // bubbleGroup.bringObjectToFront(bubbleText);
    fabricCanvas?.add(bubblePath);
    fabricCanvas?.add(bubbleText);
  };

  const addPuuungStoryboardToCanvas = () => {
    if (!fabricCanvas) return;
    // const scenes = entry?.scenes;
    const scenes = storyboardSamples;

    const numRows = Math.ceil(scenes.length / 2);
    const colWidth = fabricCanvas.width / 2;
    const totalHeight = numRows * 500; // Assume all images have a width of 500

    let x = 0;
    let y = 0;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      fabric.Image.fromURL(scene.artwork.url)
        .then((img) => {
          img.scaleToWidth(500);
          img.preserveAspectRatio = "true";
          fabricCanvas.add(img);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const bringSelectedObjectToFront = () => {
    const activeObject: any = fabricCanvas?.getActiveObject();
    if (!activeObject) return;
    fabricCanvas?.bringObjectToFront(activeObject);
  };

  const removeSelectedObject = () => {
    const activeObject: any = fabricCanvas?.getActiveObject();
    if (!activeObject) return;

    const objectType = activeObject.get("type");

    if (objectType === "i-text") {
      console.log(activeObject);
      if (!activeObject?.isEditing) {
        fabricCanvas?.remove(activeObject);
      }
    } else {
      fabricCanvas?.remove(activeObject);
    }
  };

  const removeSelectedObjects = () => {
    const activeObjects: any = fabricCanvas?.getActiveObjects();
    if (!activeObjects) return;
    activeObjects.forEach((object: any) => {
      fabricCanvas?.remove(object);
      fabricCanvas?.renderAll();
    });
  };

  // detect delete button and remove selected object
  window.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      removeSelectedObject();
    }
  });

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* navigation header */}
        <CreateHeader currentRoute={createRoutes[3]} />

        <div className="grid grid-rows-[50px_auto] overflow-hidden">
          {/* tools bar */}
          <div className="flex flex-row items-center justify-between w-full h-full bg-light-background-primary dark:bg-dark-background-primary border-y border-y-light-divider dark:border-y-dark-divider px-3">
            <div className="flex flex-row gap-1">
              <ToolbarButton
                onClick={() => {
                  const newText = new fabric.IText("Add Text", {
                    left: 50,
                    top: 50,
                  });
                  // newText.backgroundColor = "white";
                  newText.set({ fill: "black" });
                  fabricCanvas?.add(newText);
                }}
              >
                <BiText />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  const imageURL = window.prompt("Enter image URL");
                  if (!imageURL) return;
                  addImageURLToCanvas(imageURL);
                }}
              >
                <FiImage />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  addComicBubbleToCanvas();
                }}
              >
                <FiMessageSquare />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  addPuuungStoryboardToCanvas();
                }}
              >
                Add Puuung
              </ToolbarButton>
            </div>

            <div className="flex flex-row gap-1">
              {/* if current active ofject is text */}

              {currentActiveObject && currentActiveObjectType === "i-text" && (
                <ToolbarButton
                  onClick={() => {
                    const activeObject = fabricCanvas?.getActiveObject();

                    if (!activeObject) return;

                    if (activeObject.get("type") === "i-text") {
                      activeObject.set({
                        fill:
                          activeObject.get("fill") === "black"
                            ? "white"
                            : "black",
                      });
                    }
                    fabricCanvas?.renderAll();
                  }}
                >
                  Switch Color
                </ToolbarButton>
              )}

              {currentActiveObject && (
                <ToolbarButton
                  onClick={() => {
                    bringSelectedObjectToFront();
                  }}
                >
                  Bring to Front
                </ToolbarButton>
              )}

              <ToolbarButton onClick={() => {}}>Template</ToolbarButton>
            </div>
          </div>

          <div className="relative w-full h-full overflow-auto">
            {/* <canvas ref={canvasEl} width={"100%"} height={"100%"} /> */}
            {/* <Canvas onLoad={onLoad} saveState /> */}
            <canvas ref={canvasEl} width={"100%"} height={"100%"} />

            <button
              onClick={() => {
                const canvasJSON = fabricCanvas?.toJSON();
                dispatch(setCanvas(canvasJSON));
              }}
              className="fixed bottom-0 right-0 m-4 py-2 px-4 rounded-md shadow-md bg-dark-background-tertiary text-white"
            >
              Test Save JSON
            </button>
          </div>
        </div>

        {/* main content (left and right panels columns) */}
        <div
          className={clsx(
            "flex-col h-full items-center duration-300 overflow-auto gap-4 flex-shrink-0 hidden",
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
                {entry?.scenes.map(
                  (scene: Scene & StoryboardSample, index: number) => (
                    <div key={index} className="w-full flex flex-col gap-4">
                      {/* Display the diary text */}
                      <div className="w-full text-center p-2">
                        <p className="text-light-text-primary dark:text-dark-text-primary">
                          {/* {diaryTexts[index]} */}
                        </p>
                      </div>

                      <div className="w-full flex justify-center">
                        <div
                          className="group relative flex flex-col w-full max-w-[400px] mx-auto bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider aspect-auto mb-4 fade-top cursor-pointer"
                          onClick={() => handleToggleStoryboard(index)}
                        >
                          <img
                            src={
                              scene?.image_base64
                                ? "data:image/png;base64," + scene.image_base64
                                : scene?.artwork?.url ?? ""
                            }
                            alt="comic book cover"
                            className="object-cover aspect-[4/3] relative fade-top"
                            style={createFadeTopStyle()}
                          />

                          {/* story line in storyboard */}
                          {expandedStoryboardIndex === index && (
                            <div className="flex p-4">
                              <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[8]">
                                {scene?.displayed_text || scene?.text || ""}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
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

const ToolbarButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}> = ({ children, onClick, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={
        "flex flex-row items-center justify-center h-10 px-3 rounded-md hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
      }
    >
      {children}
    </button>
  );
};

export default LayoutPage;
