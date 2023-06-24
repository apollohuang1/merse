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
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiChevronDown,
  FiChevronUp,
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
  FiSun,
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
import { AlertDescription, Spinner, calc } from "@chakra-ui/react";

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

import { Excalidraw } from "@excalidraw/excalidraw";
import useColorScheme from "@/hooks/useColorScheme";
import { Bold } from "lucide-react";

type Props = {};

const canvasWidth = 768;

const Layout = (props: Props) => {
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
  const [showEntrySlideOver, setShowEntrySlideOver] =
    React.useState<boolean>(false);

  const { toggleColorScheme } = useColorScheme();

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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAddingBubble, setIsAddingBubble] = useState<boolean>(false);

  // tool bars
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);

  const [canvasBackgroundHex, setCanvasBackgroundHex] =
    useState<string>("#FFFFFF");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<number>(100);

  // add rectangle from 0,0 to 0,800

  const rectClipPath = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasWidth * 7,
    absolutePositioned: true,
  });

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
    // canvas.on("object:moving", function (options) {
    //   // check if object is image
    //   if (
    //     options.target.get("type") !== "image" &&
    //     options.target.get("type") !== "activeselection"
    //   ) {
    //     return;
    //   }

    //   options.target.set({
    //     left: Math.round(options.target.left / gridSize) * gridSize,
    //     top: Math.round(options.target.top / gridSize) * gridSize,
    //   });
    // });

    canvas.on("object:scaling", function (options) {});

    canvas.setDimensions({
      // width: canvasWidth, // square ratio
      // width: innerWidth - 250,
      width: innerWidth - 500,
      height:
        entry?.scenes.length * canvasWidth === 0
          ? canvasWidth * 7
          : entry?.scenes.length * canvasWidth + 1,
    });

    // add rectangle from 0,0 to 0,800
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvasWidth,
      // height:
      //   entry?.scenes.length * canvasWidth === 0
      //     ? canvasWidth * 7
      //     : entry?.scenes.length * canvasWidth + 1,
      height: canvasWidth * 7,
      fill: "#FFFFFF",
      strokeWidth: 1,
      stroke: "#EFEFEF",
      selectable: false,
      hasControls: false,
      evented: false,
    });

    const canvasTextOnTopOfRect = new fabric.Textbox("Comic Canvas", {
      left: 0,
      top: rect.top - 18,
      width: canvasWidth,
      height: 100,
      fontSize: 14,
      fontFamily: "Helvetica",
      strokeWidth: 0,
      fill: "#C6C6C6",
      selectable: false,
      hasControls: false,
      evented: false,
    });

    console.log(rect);

    canvas.add(rect);
    canvas.add(canvasTextOnTopOfRect);

    // stylings
    // canvas.selectionBorderColor = "#10b981"; // emerald green
    canvas.selectionBorderColor = "#2E9AFA"; // blue
    canvas.selectionColor = "#2E9AFA30";
    canvas.backgroundColor = "#F5F5F5";

    var vpt = canvas.viewportTransform;
    vpt[4] += innerWidth - 500 - (innerWidth - 500) / 2 - canvasWidth / 2;
    vpt[5] += 100;

    // canvas.backgroundColor = "transparent";

    // detect dark mode class and set background color
    // if (isDarkMode) {
    //   canvas.backgroundColor = "#161816";
    // } else {
    //   canvas.backgroundColor = "#F5F5F7";
    // }

    // const gridSize = 32;
    const gridSize = 20;

    // pinch to zoom
    canvas.on("mouse:wheel", function (opt) {
      opt.e.preventDefault();
      opt.e.stopPropagation();
      if (opt.e.ctrlKey) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.99 ** delta;
        const maxZoom = 500; // in percent
        const minZoom = 10; // in percent
        if (zoom > maxZoom / 100) zoom = maxZoom / 100; // 500%
        if (zoom < minZoom / 100) zoom = minZoom / 100; // 10%
        const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
        canvas.zoomToPoint(point, zoom);
        setZoomValue(zoom * 100);
      } else {
        var e = opt.e;
        var vpt = canvas.viewportTransform;
        vpt[4] -= e.deltaX;
        console.log("vpt[4]: ", vpt[4]);
        console.log("can width: ", canvas.width);
        if (vpt[4] <= 0) {
          vpt[4] = 0;
        }
        vpt[5] -= e.deltaY;
        canvas.requestRenderAll();
      }
    });

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
        // borderColor: "#10b981",
        borderColor: "#2E9AFA",
        borderScaleFactor: 1, // actual border width :)
        cornerSize: 7,
        cornerStrokeColor: "#2E9AFA",
        cornerColor: "white",
        transparentCorners: false,
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

    // for loop in entry?.scenes
    for (let i = 0; i < entry?.scenes.length; i++) {
      const scene = entry?.scenes[i];

      const distanceFromTop = i * canvasWidth; // square

      fabric.Image.fromURL("data:image/png;base64," + scene.image_base64, {
        crossOrigin: "anonymous",
      })
        .then((img) => {
          img.scaleToWidth(canvasWidth);
          // img.stroke = "black";
          // img.strokeWidth = 10;
          img.left = 0;
          img.top = distanceFromTop;
          img.preserveAspectRatio = "true";
          img.clipPath = rectClipPath;
          // get to the middle horizontally
          img.left = (canvasWidth - img.getScaledWidth()) / 2;

          // img.lockMovementX = true;
          canvas.add(img);
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
        img.clipPath = rectClipPath;
        // img.lockMovementX = true;
        fabricCanvas?.add(img);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const addComicBubbleToCanvas = (canvas: fabric.Canvas, positionX: number, positionY: number) => {
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
      width: 1000,
      height: 1000,
      originX: "center",
      originY: "center",
      clipPath: rectClipPath,
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
      clipPath: rectClipPath,
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
      return;
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

  const handleCanvasBackgroundColorChanged = (hex: string) => {
    setCanvasBackgroundHex(hex);

    // get all layers
    const layers = fabricCanvas?.getObjects();
    if (!layers) return;

    // set rect bg color
    layers[0].set({
      fill: hex,
    });

    fabricCanvas?.requestRenderAll();
  };

  const handleCanvasBackgroundColorReverted = () => {

    // get all layers
    const layers = fabricCanvas?.getObjects();
    if (!layers) return;

    // set rect bg color
    const currentCanvasColor = layers[0].get("fill");
    setCanvasBackgroundHex(currentCanvasColor);

    fabricCanvas?.requestRenderAll();
  };

  // detect delete button and remove selected object
  window.addEventListener("keydown", (e) => {
    // backspace and not focus on the input
    if (e.key === "Backspace" && document.activeElement?.tagName !== "INPUT") {
      removeSelectedObject();
    }
  });

  // mouse down
  // fabricCanvas?.on("mouse:down", (options) => {
  //   if (isAddingBubble) {
  //     const mousePosition = fabricCanvas?.getPointer(options.e);
  //     console.log("paste bubble at position" + mousePosition?.x + " " + mousePosition?.y)
  //     addComicBubbleToCanvas(fabricCanvas, mousePosition?.x as number, mousePosition?.y as number);
  //   }
  //   setIsAddingBubble(false);
  // });

  return (
    <>
      <div className="grid grid-rows-[48px_auto] w-full h-full">
        {/* <div className="flex flex-col overflow-hidden w-full h-screen"> */}

        {/* tool bar */}
        <div className="flex flex-row items-center justify-between w-full h-full bg-light-background-primary dark:bg-dark-background-primary border-y border-y-light-divider dark:border-y-dark-divider px-3">
          <div className="flex flex-row h-full">
            <ToolbarButton
              onClick={() => {
                const newText = new fabric.Textbox("Add Text", {
                  left: 50,
                  top: 50,
                });
                // newText.backgroundColor = "white";
                newText.set({
                  fill: "black",
                  clipPath: rectClipPath,
                });
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

          <div className="flex flex-row gap-0 h-full">
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
                // get all layers
                const layers = fabricCanvas?.getObjects();
                if (!layers) return;
              }}
            >
              <span className="text-sm">Print Layers</span>
            </ToolbarButton> */}

            {/* <div className="flex fllex-col border-r border-light-divider dark:border-dark-divider"></div> */}

            {/* <ToolbarButton onClick={() => setShowTemplateSlideOver(true)}>
                <div className="flex flex-row items-center gap-1">
                  <FiGrid />
                  Templates
                </div>
              </ToolbarButton> */}
          </div>
        </div>

        <div className="relative flex flex-col w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary">
          <div className={`absolute flex flex-col w-full h-full overflow-auto`}>
            <Canvas onLoad={onLoad} saveState />
          </div>

          <div className="absolute grid grid-cols-[auto_250px] w-full h-full pointer-events-none">
            <div className="relative w-full h-full">
              {/* floating elements on top of canvas */}
              <div className="absolute flex flex-col inset-0 w-full h-full pointer-events-none p-6 justify-end">
                <div className="flex flex-col w-full h-full justify-between">
                  <div className="flex flex-row w-full items-center justify-end"></div>

                  <div className="flex flex-row w-full items-center justify-between pointer-events-auto">
                    {/* zoom controller */}
                    <div className="flex flex-row text-light-text-secondary dark:text-dark-text-secondary items-center backdrop-blur-xl bg-light-background-primary dark:bg-dark-background-primary bg-opacity-80 dark:bg-opacity-80 drop-shadow-2xl rounded-xl h-8 overflow-clip divide-none divide-light-divider dark:divide-dark-divider">
                      <button
                        onClick={() => {}}
                        className="flex px-2 h-full items-center justify-center hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          fabricCanvas?.setZoom(1);
                          setZoomValue(100);
                          var vpt = fabricCanvas?.viewportTransform;
                          if (vpt) {
                            vpt[4] = 0;
                            vpt[5] = 0;
                            vpt[4] +=
                              innerWidth -
                              500 -
                              (innerWidth - 500) / 2 -
                              canvasWidth / 2;
                            vpt[5] += 100;
                          }
                        }}
                        className="flex flex-row items-center justify-center text-xs w-8 h-full text-light-text-primary dark:text-dark-text-primary select-none"
                      >
                        <span>{zoomValue.toFixed(0)}%</span>
                      </button>

                      <button
                        onClick={() => {}}
                        className="flex px-2 h-full items-center justify-center hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        // const canvasJSON = fabricCanvas?.toJSON();
                        // dispatch(setCanvas(canvasJSON));

                        // deselect object
                        fabricCanvas?.discardActiveObject();
                        fabricCanvas?.requestRenderAll();

                        // convert fabriccanvas to base64 image string
                        const canvasImageBase64 = fabricCanvas?.toDataURL({
                          // @ts-ignore
                          format: "png",
                          quality: 1,
                          width: canvasWidth,
                          height:
                            entry?.scenes.length * canvasWidth === 0
                              ? canvasWidth * 7
                              : entry?.scenes.length * canvasWidth + 1,
                          top: 0,
                          left: 0,
                        });

                        console.log(canvasImageBase64);
                        dispatch(setCanvas(canvasImageBase64));
                      }}
                      className="flex rounded-md shadow-md bg-dark-background-tertiary text-white pointer-events-auto px-4 py-2 hidden"
                    >
                      Test Save Image
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary pointer-events-auto border-l border-light-divider dark:border-dark-divider">
              {/* background colors pickers */}
              
              <SideBarContainer title="Canvas">
                <div className="flex flex-row gap-3 items-center">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          onClick={() => {
                            setShowColorPicker(!showColorPicker);
                          }}
                          className="outline-none w-10 h-5 flex border border-light-dividerContrast dark:border-dark-dividerContrast"
                          style={{
                            backgroundColor: canvasBackgroundHex,
                          }}
                        ></Popover.Button>

                        <Popover.Panel className="absolute z-10 right-[calc(-12px)]">
                          {({ close }) => (
                            <div className="flex flex-col absolute z-10 top-3 right-3 bg-light-background-primary drop-shadow-2xl rounded-md overflow-clip">
                              <div className="flex flex-row px-3 py-3 justify-between border-b border-b-light-divider">
                                <button
                                  onClick={() =>
                                    handleCanvasBackgroundColorChanged(
                                      "#FFFFFF"
                                    )
                                  }
                                  className="font-medium text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary hover:dark:text-dark-text-primary"
                                >
                                  Default
                                </button>

                                <button
                                  onClick={() => {
                                    close();
                                  }}
                                  className="text-accent font-medium hover:text-emerald-600 text-sm"
                                >
                                  Done
                                </button>
                              </div>

                              <div className="rounded-none overflow-clip">
                                <SwatchesPicker
                                  // className="flex shadow-none bg-light-background-primary dark:bg-dark-background-primary"
                                  // className={createStyles.colorPicker}
                                  onChangeComplete={(color: any) =>
                                    handleCanvasBackgroundColorChanged(
                                      color.hex
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </Popover.Panel>
                      </>
                    )}
                  </Popover>

                  <input
                    value={canvasBackgroundHex.toUpperCase()}
                    className="outline-none w-full focus:ring-1 focus:ring-emerald-500 px-2 py-1 rounded-md bg-light-background-secondary dark:bg-dark-background-tertiary text-sm"
                    onChange={(e) => {
                      setCanvasBackgroundHex(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // check if the input is valid hex

                        // if the input starts with # then check the Regex, and if not, still check for value and convert to hex with #
                        if (!/^#[0-9A-F]{6}$/i.test(canvasBackgroundHex)) {
                          // check if it's value hex even without #
                          if (/^[0-9A-F]{6}$/i.test(canvasBackgroundHex)) {
                            handleCanvasBackgroundColorChanged(
                              "#" + canvasBackgroundHex
                            );
                            return;
                          }

                          // revert
                          handleCanvasBackgroundColorReverted();
                          return;
                        }
                        handleCanvasBackgroundColorChanged(canvasBackgroundHex);
                      }
                    }}
                  />
                </div>
              </SideBarContainer>

              {/* <div className="flex flex-col p-3 border-b border-light-divider dark:border-dark-divider">
                <span>Canvas</span>
              </div> */}

              {/* text class edit */}
              {currentActiveObject && currentActiveObjectType === "i-text" && (
                <SideBarContainer title="Text">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3 w-full">
                      <Menu
                        as="div"
                        className="relative inline-block text-left w-full"
                      >
                        <Menu.Button className="flex flex-1 flex-row items-center w-full flex-shrink-0 text-sm justify-center gap-x-1.5 px-4 h-8 hover:bg-light-background-secondary  dark:hover:bg-dark-background-secondary border border-light-divider dark:border-dark-divider rounded-md">
                          <span className="line-clamp-1">{selectedFont}</span>
                          <FiChevronDown
                            className="-mr-1 h-4 w-4 text-light-text-tertiary dark:text-dark-text-tertiary"
                            aria-hidden="true"
                          />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-light-background-primary dark:bg-dark-background-secondary shadow-lg focus:outline-none ring-1 ring-light-divider dark:ring-dark-divider drop-shadow-2xl">
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

                                        if (
                                          activeObject.get("type") === "i-text"
                                        ) {
                                          activeObject.set({
                                            fontFamily: font,
                                          });
                                        }
                                        fabricCanvas?.requestRenderAll();
                                        setSelectedFont(font);
                                      }}
                                      className={clsx(
                                        `flex flex-row px-4 py-2 text-sm w-full items-center justify-start hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary font-[${font}]`
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

                      {/* font number input */}
                      <input
                        type="number"
                        className="flex items-center justify-center px-3 w-16 h-7 rounded-md bg-light-background-secondary dark:bg-dark-background-tertiary text-sm outline-none focus:ring-1 ring-emerald-500"
                        // value={currentActiveObject.fontSize * currentActiveObject.scaleX}  but make it floating 1 point format
                        // value={(currentActiveObject.fontSize * currentActiveObject.scaleX).toFixed(0).toString()}
                        value={fontSize}
                        onKeyDown={(e) => {
                          // if enter pressed
                          if (e.key === "Enter") {
                            e.preventDefault();
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
                    </div>

                    <div className="flex flex-row items-center gap-3">
                      <button 
                        onClick={() => {
                          currentActiveObject.set({
                            textAlign: "left"
                          })
                          fabricCanvas?.requestRenderAll();
                        }}
                        className="flex items-center justify-center w-8 h-8 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary rounded-md"
                      >
                        <FiAlignLeft />
                      </button>

                      <button
                        onClick={() => {
                          currentActiveObject.set({
                            textAlign: "center"
                          })
                          fabricCanvas?.requestRenderAll();
                        }}
                        className="flex items-center justify-center w-8 h-8 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary rounded-md"
                      >
                        <FiAlignCenter />
                      </button>

                      <button
                        onClick={() => {
                          currentActiveObject.set({
                            textAlign: "right"
                          })
                          fabricCanvas?.requestRenderAll();
                        }}
                        className="flex items-center justify-center w-8 h-8 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary rounded-md"
                      >
                        <FiAlignRight />
                      </button>

                      {/* <button
                        onClick={() => {
                          currentActiveObject.set({
                            fontWeight: "bold"
                          })
                          fabricCanvas?.requestRenderAll();
                        }}
                        className="flex items-center justify-center w-8 h-8 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary rounded-md"
                      >
                        <Bold className="w-3 h-3"/>
                      </button> */}
                      
                    </div>
                  </div>
                </SideBarContainer>
              )}

              {currentActiveObject && currentActiveObjectType === "image" && (
                <SideBarContainer title="Image">
                  <div className="flex flex-row gap-3 text-sm items-center">
                    <div className="flex flex-row gap-3 items-center">
                      W
                      <input
                        value={currentActiveObject?.width}
                        type="text"
                        className="outline-none w-full focus:ring-1 focus:ring-emerald-500 px-2 py-1 rounded-md bg-light-background-secondary dark:bg-dark-background-tertiary"
                      />
                    </div>

                    <div className="flex flex-row gap-3 items-center">
                      H
                      <input
                        value={currentActiveObject?.height}
                        type="text"
                        className="outline-none w-full focus:ring-1 focus:ring-emerald-500 px-2 py-1 rounded-md bg-light-background-secondary dark:bg-dark-background-tertiary"
                      />
                    </div>
                  </div>
                </SideBarContainer>
              )}

              {currentActiveObject && (
                <div className="flex flex-col border-b border-light-divider dark:border-dark-divider p-3">
                  <button
                    onClick={() => {
                      bringSelectedObjectToFront();
                    }}
                  >
                    <span className="text-sm">Bring to Front</span>
                  </button>
                </div>
              )}
            </div>
          </div>
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
                fabricCanvas
                  ?.loadFromJSON(selectedTemplate, () => {
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
        "relative flex flex-row items-center justify-center h-full text-sm px-3 rounded-none hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
        {
          "bg-dark-background-secondary": isActive,
        }
      )}
    >
      {children}
    </button>
  );
};

const SideBarContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="flex flex-col w-full h-auto p-4 border-b border-light-divider dark:border-dark-divider items-start gap-4">
      <span className="text-sm font-semibold">{title}</span>

      {children}
    </div>
  );
};

export default Layout;
