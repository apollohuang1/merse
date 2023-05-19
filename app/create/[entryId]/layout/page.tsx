"use client";

import CreateHeader from "@/components/create/create-header";
import React, {
  FormEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FiBold,
  FiChevronDown,
  FiCode,
  FiEdit2,
  FiGrid,
  FiImage,
  FiItalic,
  FiList,
  FiMessageCircle,
  FiMessageSquare,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

import { BiColorFill, BiText } from "react-icons/bi";
import { CSSProperties } from "react";

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
  allFonts,
  createRoutes,
  puuungCanvasTemplate1,
  puuungCanvasTemplate2,
  puuungCanvasTemplate3,
  storyboardSamples,
  unsplashTemplate1,
  unsplashTemplate2,
  unsplashTemplate3,
} from "@/util/constants/create-constants";

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

import {
  ChromePicker,
  SketchPicker,
  SwatchesPicker,
  TwitterPicker,
} from "react-color";
import { Menu, Popover, Transition } from "@headlessui/react";
import SlideOver from "@/components/slide-over";
import Divider from "@/components/divider";

type Props = {};

const canvasWidth = 768;

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

  const [showTemplateSlideOver, setShowTemplateSlideOver] =
    React.useState<boolean>(false);

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
    const output = updatedEditor?.editor?.getHTML();
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

  // tool bars
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const onLoad = useCallback((canvas: fabric.Canvas) => {
    const isDarkMode = localStorage.getItem("theme") === "dark";

    // load json if exist in entry?.canvas

    // if (entry?.canvas) {
    //   canvas.loadFromJSON(entry?.canvas, async (o, object) => {
    //     canvas.requestRenderAll();
    //   });
    // }

    // const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement);
    // make the fabric.Canvas instance available to your app
    setFabricCanvas(canvas);

    // snap to grid
    canvas.on("object:moving", function (options) {
      // check if object is image
      if (
        options.target.get("type") !== "image" &&
        options.target.get("type") !== "activeselection"
      ) {
        return;
      }

      options.target.set({
        left: Math.round(options.target.left / gridSize) * gridSize,
        top: Math.round(options.target.top / gridSize) * gridSize,
      });
    });

    canvas.on("object:scaling", function (options) {});

    canvas.setDimensions({
      width: canvasWidth, // square ratio
      height: canvasWidth * 7,
    });

    // stylings
    canvas.selectionBorderColor = "#10b981";
    canvas.selectionColor = "rgba(16, 185, 129, 0.3)";
    canvas.backgroundColor = "#FFFFFF";

    // detect dark mode class and set background color
    // if (isDarkMode) {
    //   canvas.backgroundColor = "#161816";
    // } else {
    //   canvas.backgroundColor = "#F5F5F7";
    // }

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

    // window.addEventListener("resize", () => {
    //   console.log("resized width and height to: ", innerWidth, innerHeight);

    //   var widthValueToSet = innerWidth - 250;

    //   if (innerWidth < 1024) {
    //     widthValueToSet = innerWidth - 175;
    //   }

    //   if (innerWidth < 640) {
    //     widthValueToSet = innerWidth;
    //   }

    //   // fabricCanvas?.setDimensions({
    //   //   width: widthValueToSet,
    //   //   height: innerHeight * 4,
    //   // });

    //   console.log("canvas width and height: ", canvas.width, canvas.height);
    // });

    canvas.on("selection:created", function (options) {
      const activeObject = canvas.getActiveObject();

      // @ts-ignore
      setCurrentActiveObject(activeObject);
      setCurrentActiveObjectType(activeObject?.get("type") ?? null);

      canvas.getActiveObject()?.setControlsVisibility({
        mt: false,
        mb: false,
        ml: activeObject?.get("type") === "i-text" ? true : false,
        mr: activeObject?.get("type") === "i-text" ? true : false,
      });

      if (activeObject?.get("type") === "i-text") {
        console.log(activeObject);
        setSelectedFont(activeObject?.get("fontFamily"));
        setFontSize(activeObject?.get("fontSize"));
      }

      activeObject?.set({
        borderColor: "#10b981",
        borderScaleFactor: 2, // actually border width :)
      });
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

    addComicBubbleToCanvas(canvas);

    return () => {
      setFabricCanvas(null);
      canvas.dispose();
      // window.removeEventListener("resize", () => {});
    };
  }, []); // end on canvas init

  const addImageURLToCanvas = (url: string) => {
    fabric.Image.fromURL(url, { crossOrigin: "anonymous" })
      .then((img) => {
        img.scaleToWidth(canvasWidth);
        // img.stroke = "black";
        // img.strokeWidth = 10;
        img.left = 0;
        img.preserveAspectRatio = "true";
        // img.lockMovementX = true;
        fabricCanvas?.add(img);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addComicBubbleToCanvas = (canvas?: fabric.Canvas) => {
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

    if (canvas) {
      canvas.add(bubblePath);
      canvas.add(bubbleText);
    }

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
      addImageURLToCanvas(scene.artwork.url);
    }
  };

  const bringSelectedObjectToFront = () => {
    const activeObject: any = fabricCanvas?.getActiveObject();
    if (!activeObject) return;
    fabricCanvas?.bringObjectToFront(activeObject);
  };

  const removeSelectedObject = () => {
    const activeObject: any = fabricCanvas?.getActiveObject();
    const activeGroup = fabricCanvas?.getActiveObjects();
    if (!activeObject) return;

    const objectType = activeObject.get("type");

    if (activeGroup && activeGroup.length > 1) {
      // group
      fabricCanvas?.discardActiveObject();
      fabricCanvas?.remove(...activeGroup);
      return
    }

    // single object
    if (objectType === "i-text") {
      if (!activeObject?.isEditing) {
        fabricCanvas?.remove(activeObject);
      }
    } else {
      fabricCanvas?.remove(activeObject);
    }
  };

  // detect delete button and remove selected object
  window.addEventListener("keydown", (e) => {
    // backspace and not focus on the input
    if (e.key === "Backspace" && document.activeElement?.tagName !== "INPUT") {
      removeSelectedObject();
    }
  });

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* navigation header */}
        <CreateHeader currentRoute={createRoutes[3]} nextDisabled={false} />

        <div className="grid grid-rows-[50px_auto] overflow-hidden">
          {/* tools bar */}
          <div className="flex flex-row items-center justify-between w-full h-full bg-light-background-primary dark:bg-dark-background-primary border-y border-y-light-divider dark:border-y-dark-divider px-3">
            <div className="flex flex-row gap-1">
              <ToolbarButton
                onClick={() => {
                  const newText = new fabric.Textbox("Add Text", {
                    left: 50,
                    top: 50,
                  });
                  // newText.backgroundColor = "white";
                  newText.set({ fill: "black" });
                  fabricCanvas?.add(newText);
                }}
              >
                <IoText className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  const imageURL = window.prompt("Enter image URL");
                  if (!imageURL) return;
                  addImageURLToCanvas(imageURL);
                }}
              >
                <FiImage className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  addComicBubbleToCanvas();
                }}
              >
                <FiMessageCircle className="w-4 h-4" />
              </ToolbarButton>

              {/* <ToolbarButton
                onClick={() => {
                  addPuuungStoryboardToCanvas();
                }}
              >
                Add Puuung
              </ToolbarButton> */}
            </div>

            <div className="flex flex-row gap-1">
              {/* if current active ofject is text */}

              {/* {currentActiveObject && currentActiveObjectType === "i-text" && (
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
                    fabricCanvas?.requestRenderAll();
                  }}
                >
                  Switch Color
                </ToolbarButton>
              )} */}

              {/* <ToolbarButton
                onClick={() => {
                  // get active
                  const activeObject = currentActiveObject;
                  console.log(activeObject);
                }}
              >
                Print Active
              </ToolbarButton> */}

              {currentActiveObject && (
                <ToolbarButton
                  onClick={() => {
                    bringSelectedObjectToFront();
                  }}
                >
                  Bring to Front
                </ToolbarButton>
              )}

              {/* // when focus is text */}
              {currentActiveObject && currentActiveObjectType === "i-text" && (
                <>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex flex-row items-center w-full justify-center gap-x-1.5 rounded-md px-3 h-10 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary">
                        {selectedFont}
                        <FiChevronDown
                          className="-mr-1 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-light-background-primary dark:bg-dark-background-primary shadow-lg focus:outline-none ring-1 ring-light-divider dark:ring-dark-divider">
                        <div className="py-1">
                          {allFonts.map((font: string, index: number) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    // set active text font
                                    const activeObject =
                                      fabricCanvas?.getActiveObject();
                                    if (!activeObject) return;

                                    if (activeObject.get("type") === "i-text") {
                                      activeObject.set({
                                        fontFamily: font,
                                      });
                                    }
                                    fabricCanvas?.requestRenderAll();
                                    setSelectedFont(font);
                                  }}
                                  className={clsx(
                                    `flex flex-row px-4 py-2 text-sm w-full items-start hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary font-[${font}]`,
                                  )}
                                >
                                  {font} {selectedFont === font && "✓"}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <div className="flex flex-row items-center gap-1">
                    <ToolbarButton
                      onClick={() => {
                        setFontSize((prev) => prev - 1);
                        const activeObject = fabricCanvas?.getActiveObject();
                        if (!activeObject) return;

                        if (activeObject.get("type") === "i-text") {
                          activeObject.set({
                            fontSize: activeObject.get("fontSize") - 1,
                          });
                        }
                        fabricCanvas?.requestRenderAll();
                      }}
                    >
                      <FiMinus />
                    </ToolbarButton>

                    {/* font number input */}
                    <input
                      type="number"
                      className="flex items-center justify-center px-3 w-16 h-8 rounded-md bg-light-background-secondary dark:bg-dark-background-tertiary text-light-text-secondary dark:text-dark-text-secondary outline-none focus:ring-1 ring-emerald-500"
                      // value={currentActiveObject.fontSize * currentActiveObject.scaleX}  but make it floating 1 point format
                      // value={(currentActiveObject.fontSize * currentActiveObject.scaleX).toFixed(0).toString()}
                      value={fontSize}
                      onKeyDown={(e) => {
                        // if enter pressed
                        if (e.key === "Enter") {
                          const activeObject = fabricCanvas?.getActiveObject();
                          if (!activeObject) return;

                          if (activeObject.get("type") === "i-text") {
                            activeObject.set({
                              fontSize: fontSize,
                            });
                          }
                          fabricCanvas?.requestRenderAll();
                        }
                      }}
                      onChange={(e) => {
                        setFontSize(parseInt(e.target.value));
                      }}
                    />

                    <ToolbarButton
                      onClick={() => {
                        setFontSize(fontSize + 1);
                        const activeObject = fabricCanvas?.getActiveObject();
                        if (!activeObject) return;

                        if (activeObject.get("type") === "i-text") {
                          activeObject.set({
                            fontSize: activeObject.get("fontSize") + 1,
                          });
                        }
                        fabricCanvas?.requestRenderAll();
                      }}
                    >
                      <FiPlus />
                    </ToolbarButton>
                  </div>
                </>
              )}

              <div className="flex fllex-col border-r border-light-dividerContrast dark:border-dark-dividerContrast"></div>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="outline-none">
                      <ToolbarButton
                        onClick={() => {
                          setShowColorPicker(!showColorPicker);
                        }}
                        isActive={open}
                      >
                        <BiColorFill className="w-5 h-5" />
                      </ToolbarButton>
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 right-[calc(-12px)]">
                      {({ close }) => (
                        <div className="flex flex-col absolute z-10 top-3 right-3 bg-light-background-primary dark:bg-dark-background-primary drop-shadow-2xl rounded-xl overflow-clip">
                          <div className="flex flex-row px-3 py-3 justify-between border-b border-b-light-divider dark:border-b-dark-divider">
                            <button
                              onClick={() => {
                                fabricCanvas?.set({
                                  backgroundColor: "transparent",
                                });
                                fabricCanvas?.requestRenderAll();
                              }}
                              className="font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary hover:dark:text-dark-text-primary"
                            >
                              Transparent
                            </button>

                            <button
                              onClick={() => {
                                close();
                              }}
                              className="text-accent font-medium hover:text-emerald-600"
                            >
                              Done
                            </button>
                          </div>

                          <div className="rounded-none overflow-clip">
                            <SwatchesPicker
                              // className="flex shadow-none bg-light-background-primary dark:bg-dark-background-primary"
                              // className={createStyles.colorPicker}
                              onChangeComplete={(color: any) => {
                                // alert(color.hex);
                                fabricCanvas?.set({
                                  backgroundColor: color.hex,
                                });
                                fabricCanvas?.requestRenderAll();
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>

              {/* <ToolbarButton onClick={() => setShowTemplateSlideOver(true)}>
                <div className="flex flex-row items-center gap-1">
                  <FiGrid />
                  Templates
                </div>
              </ToolbarButton> */}

            </div>
          </div>

          <div className="flex flex-col items-center relative w-full h-full overflow-auto bg-light-background-secondary dark:bg-dark-background-secondary">

            <div className={`flex flex-col w-[${canvasWidth}px] h-[${canvasWidth * 7}px] bg-light-background-secondary`}>
              <Canvas onLoad={onLoad} saveState />
            </div>

            <button
              onClick={() => {
                // const canvasJSON = fabricCanvas?.toJSON();
                // dispatch(setCanvas(canvasJSON));

                // convert fabriccanvas to base64 image string
                const canvasImageBase64 = fabricCanvas?.toDataURL({
                  // @ts-ignore
                  format: "png",
                  quality: 1,
                  width: canvasWidth,
                  height: canvasWidth * 7,
                });

                console.log(canvasImageBase64);
                dispatch(setCanvas(canvasImageBase64))
              }}
              className="fixed bottom-0 right-0 m-4 py-2 px-4 rounded-md shadow-md bg-dark-background-tertiary text-white"
            >
              Test Save Image
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

      <style>{` 
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

      <SlideOver
        onClose={() => {
          setShowTemplateSlideOver(false);
        }}
        isOpen={showTemplateSlideOver}
        title="Templates"
        withCloseButton={true}
      >
        <div className="grid grid-cols-2 gap-6 py-4">
          {[
            puuungCanvasTemplate1,
            puuungCanvasTemplate2,
            puuungCanvasTemplate3,
            unsplashTemplate1,
            unsplashTemplate2,
            unsplashTemplate3,
          ].map((selectedTemplate: any, index) => (
            <button
              key={index}
              className={clsx(
                "aspect-square border border-light-divider dark:border-dark-divider rounded-xl hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary active:scale-95 transition-all duration-200",
                {
                  "ring-2 ring-emerald-500 bg-light-background-secondary dark:bg-dark-background-secondary":
                    selectedTemplate == entry?.canvas,
                }
              )}
              onClick={() => {
                fabricCanvas?.loadFromJSON(selectedTemplate, () => {
                    dispatch(setCanvas(selectedTemplate));
                    fabricCanvas?.requestRenderAll();
                  })
                  .catch((err) => {
                    console.log(
                      "Failed to load template 1, message: " + err.message
                    );
                  });
              }}
            >
              {index < 3 ? "Puuung" : "Unsplash"}
              <br />
              Template #{index + 1}
            </button>
          ))}
        </div>
      </SlideOver>
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
      className={clsx(
        "relative flex flex-row items-center justify-center h-10 px-3 rounded-md hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
        {
          "bg-light-background-secondary dark:bg-dark-background-secondary":
            isActive,
        }
      )}
    >
      {children}
    </button>
  );
};

export default LayoutPage;
