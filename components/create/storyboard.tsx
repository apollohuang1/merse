"use client";

import CreateHeader from "@/components/create/create-header";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  FiArrowUp,
  FiBold,
  FiCheck,
  FiCheckCircle,
  FiCode,
  FiEdit2,
  FiImage,
  FiItalic,
  FiList,
  FiMoreHorizontal,
  FiPlus,
  FiX,
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
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

// ChakraUI
import { NumberIncrementStepperProps, Spinner } from "@chakra-ui/react";

// import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import {
  StoryboardSample,
  createRoutes,
  manualWhitelistedEmails,
  storyboardSamples,
} from "@/util/constants/create-constants";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  setContent,
  setNotificationContent,
  setScenes,
  setShowGeneratedStoryboard,
  setTitle,
  toggleShowChat,
} from "@/redux-store/store";
import useCreateEntry from "@/hooks/useCreateEntry";
import Blockquote from "@tiptap/extension-blockquote";
import { Scene } from "@/models/entry";
import Spotify from "@/components/editor/extensions/spotify";

import { Transition } from "@headlessui/react";
import SlashCommand from "../editor/extensions/slash-commands";
import { TiptapEditorProps } from "../editor/editor-props";

// Collaborative editing
// import { HocuspocusProvider } from '@hocuspocus/provider';
// import { WebrtcProvider } from "y-webrtc";
// import * as Y from "yjs";
// import { IndexeddbPersistence } from 'y-indexeddb'; // persistence

// const ydoc = new Y.Doc();
// const provider = new WebrtcProvider("tiptap-collaboration-extension", ydoc);

// Store the Y document in the browser
// new IndexeddbPersistence('example-document', ydoc)

type Props = {};

const Storyboard = (props: Props) => {
  // hooks
  const { generateStoryboard, createImageFromText, addSceneFromCustomPrompt } =
    useCreateEntry();

  // redux states
  const auth = useAppSelector((state) => state.auth);
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const dispatch = useAppDispatch();

  // edit storyboard scene text
  const [editingSceneIndex, setEditingSceneIndex] = useState<number | null>(
    null
  );
  const [originalSceneText, setOriginalSceneText] = useState<string>("");
  const [newSceneText, setNewSceneText] = useState<string>("");

  // useRef
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  // useStates
  const [showAddingImageModal, setShowAddingImageModal] =
    React.useState<boolean>(false);
  const [addingImageURL, setAddingImageURL] = React.useState<string>("");
  const [chatInputText, setChatInputText] = React.useState<string>("");
  const [isChatResponseLoading, setIsChatResponseLoading] =
    React.useState<boolean>(false);

  const [customPromptText, setCustomPromptText] = React.useState<string>("");
  const [isGeneratingCustomScene, setIsGeneratingCustomScene] =
    React.useState<boolean>(false);

  type VariantGenerationProcess = {
    sceneIndex: number;
    isGenerating: boolean;
  };

  const [currentVariantsProcessThread, setCurrentVariantsProcessThread] =
    React.useState<VariantGenerationProcess[]>([]);

  const [isEnterPressed, setIsEnterPressed] = React.useState<boolean>(false);

  interface ImageVariant {
    sceneIndex: number;
    variants: string[]; // array to hold the URLs or identifiers of generated image variants
    selectedVariantIndex: number | null; // index of the selected variant, null if no variant is selected
  }

  const [imageVariants, setImageVariants] = useState<ImageVariant[]>([]);

  // Set up the Hocuspocus WebSocket provider
  // const provider = new HocuspocusProvider({
  //   url: "ws://127.0.0.1:1234",
  //   name: "example-document",
  // });

  const handleDeleteScene = (index: number) => {
    setImageVariants((prevVariants) => {
      let newVariants = [...prevVariants];
      newVariants = newVariants.filter((iv) => iv.sceneIndex !== index);
      newVariants = newVariants.map((iv) =>
        iv.sceneIndex > index ? { ...iv, sceneIndex: iv.sceneIndex - 1 } : iv
      );
      return newVariants;
    });

    const newScenes = [...entry.scenes];
    newScenes.splice(index, 1);
    dispatch(setScenes(newScenes));
  };

  const handleEditScene = (index: number) => {
    // Set the index of the scene being edited
    setEditingSceneIndex(index);
    // Set the newSceneText to be the original text of the scene
    const originalText =
      entry.scenes[index]?.displayed_text || entry.scenes[index]?.text || "";
    setNewSceneText(originalText);
    // Also store the original text in case we want to revert later
    setOriginalSceneText(originalText);
  };

  const handleSaveScene = (index: number) => {
    const updatedScenes = [...(entry?.scenes || [])];
    updatedScenes[index] = {
      ...updatedScenes[index],
      displayed_text: newSceneText,
    };

    // Dispatch an action to update the scenes in your Redux store
    dispatch(setScenes(updatedScenes));

    // Then clear the editing state
    setEditingSceneIndex(null);
    setNewSceneText("");
  };

  const handleGenerateImagesVariants = async (index: number) => {
    // Set the current variant generation process
    setCurrentVariantsProcessThread((prevState) => {
      const newState = [...prevState];
      newState.push({ sceneIndex: index, isGenerating: true });
      return newState;
    });

    const updated_image_base64_variants: string[] = [];

    // for loop 4 times
    for (let i = 0; i < 4; i++) {
      const base64String = await createImageFromText(
        entry.scenes[index].prompt
      );
      updated_image_base64_variants.push(base64String);
    }
    // for (let i = 0; i < 4; i++) {
    //   const base64String = await createImageFromText(
    //     entry.scenes[index].prompt
    //   );
    //   updated_image_base64_variants.push(base64String);
    // }

    // Update local state
    const existingEntryIndex = imageVariants.findIndex(
      (iv) => iv.sceneIndex === index
    );

    if (existingEntryIndex >= 0) {
      setImageVariants((prevState) => {
        const newState = [...prevState];
        newState[existingEntryIndex].variants = updated_image_base64_variants;
        // Reset selectedVariantIndex to null because we're generating new variants
        newState[existingEntryIndex].selectedVariantIndex = null;
        return newState;
      });
    } else {
      setImageVariants((prevState) => [
        ...prevState,
        {
          sceneIndex: index,
          variants: updated_image_base64_variants,
          selectedVariantIndex: null,
        },
      ]);
    }

    // remove the current variant generation process with index
    setCurrentVariantsProcessThread((prevState) => {
      const newState = [...prevState];
      return newState.filter((v) => v.sceneIndex !== index);
    });
    // onImageGenerated(updated_image_base64_variants); // Use the callback
  };

  const handleVariantClick = (sceneIndex: number, variantIndex: number) => {
    setImageVariants((prevState) => {
      const newState = [...prevState];
      // exact selected scene in storyboard
      const sceneVariant = newState.find((iv) => iv.sceneIndex === sceneIndex);

      if (sceneVariant) {
        // if selected, unselect
        if (sceneVariant.selectedVariantIndex === variantIndex) {
          sceneVariant.selectedVariantIndex = null;
        } else {
          sceneVariant.selectedVariantIndex = variantIndex;
        }
      }
      return newState;
    });
  };

  const handleRevertScene = (index: number) => {
    const updatedScenes = [...(entry?.scenes || [])];
    updatedScenes[index] = {
      ...updatedScenes[index],
      displayed_text: originalSceneText,
    };

    // Dispatch an action to update the scenes in your Redux store
    dispatch(setScenes(updatedScenes));

    // Then clear the editing state
    setEditingSceneIndex(null);
    setNewSceneText("");
  };

  const editor = useEditor({
    editorProps: TiptapEditorProps,
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
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          // return "Press '/' for commands, or '++' for AI autocomplete...";
          return "Press '/' for commands...";
        },
        includeChildren: true,
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
      SlashCommand,
      // Collaboration.configure({
      //   document: provider.document,
      // }),
      // CollaborationCursor.configure({
      //   provider: provider,
      //   user: {
      //     name: 'Cyndi Lauper',
      //     color: '#f783ac',
      //   },
      // }),
    ],
    // editorProps: {
    //   attributes: {
    //     class:
    //       "outline-none w-full h-full bg-transparent min-h-[calc(100vh-300px)] highlight selection:bg-[#3cc9a3] selection:bg-opacity-25",
    //   },
    // },
  });

  // useEffect(() => {
  //   if (!editor) return;
  //   editor.commands.updateUser({
  //     name: auth?.currentUser?.name ?? "Anonymous",
  //     color: '#10b981',
  //     avatar: 'https://pbs.twimg.com/profile_images/1653106037262798848/xIwPY8Ws_400x400.jpg',
  //   })
  // }, [editor])

  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(0);

  const scrollToChatBottom = () => {
    setTimeout(() => {
      const chatScrollSection = document.getElementById("chat-content");
      chatScrollSection?.scrollTo({
        top: chatScrollSection.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  // const handleSendMessage = async () => {
  //   try {
  //     if (!manualWhitelistedEmails.includes(auth?.currentUser?.email)) {
  //       // alert to let people know we're still developing
  //       alert(
  //         "Sorry, we're still developing this feature. We will let you know when it's ready!"
  //       );
  //       throw new Error("User not whitelisted");
  //     }
  //     setIsChatResponseLoading(true);

  //     // add new message to chatMessages array
  //     const newChatMessage: openai.ChatCompletionRequestMessage = {
  //       role: "user",
  //       content: chatInputText,
  //     };

  //     dispatch(addChatMessage(newChatMessage));
  //     setChatInputText("");
  //     scrollToChatBottom();

  //     const configuration = new Configuration({
  //       apiKey: process.env.OPENAI_API_KEY as string,
  //     });

  //     const openAIAPI = new OpenAIApi(configuration);

  //     // {"role": "system", "content": "You are a helpful assistant."},
  //     const systemMessage: openai.ChatCompletionRequestMessage = {
  //       role: "system",
  //       content:
  //         "You are a compassionate AI companion, dedicated to helping users reflect on their day and providing a supportive space. Your vast knowledge of human nature and empathetic nature make you the perfect listener and therapist. Begin the conversation by gently asking users about their day, showing genuine interest in their emotions and experiences. Remember, some may find it challenging to express themselves, so use open-ended questions to help them explore their feelings further. Your goal is to make users feel good, offering kind and understanding responses. At the end of the chat session, surprise them by generating a tiptap storyboard summarizing the highlights of their day. With your caring presence and insightful conversations, you can create a meaningful and uplifting experience for every user you engage with." +
  //         "User's name is: " +
  //         (auth?.currentUser?.name as string).split(" ")[0] +
  //         ". When user ask you to summarize, act as if you're them writing down about their day and the language should be in first person.",
  //     };

  //     const completionResponse = await openAIAPI.createChatCompletion({
  //       model: "gpt-3.5-turbo",
  //       // messages: [...chatMessages, { role: "user", content: chatInputText}],
  //       messages: [systemMessage, ...entry?.chat_messages, newChatMessage],
  //       temperature: 0.7,
  //     });

  //     const responseMessage =
  //       completionResponse.data.choices[0].message?.content;

  //     if (!responseMessage) return;

  //     dispatch(addChatMessage({ role: "assistant", content: responseMessage }));

  //     setIsChatResponseLoading(false);

  //     scrollToChatBottom();

  //     // setChatInputText("");
  //   } catch (error: any) {
  //     setIsChatResponseLoading(false);
  //     console.log(error);
  //   }
  // };

  const rightPanelScrollToBottom = () => {
    setTimeout(() => {
      // scroll down to bottom with div id right-panel-scroll smoothly
      const element = document.getElementById("right-panel-scroll");
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 0);
  };

  useEffect(() => {
    // scroll without smooth
    const chatScrollSection = document.getElementById("chat-content");
    chatScrollSection?.scrollTo({
      top: chatScrollSection.scrollHeight,
      behavior: "auto",
    });
  }, []);

  useEffect(() => {
    if (editor) {
      editor?.commands.setContent(entry?.content);
    }
  }, [editor]);

  editor?.on("update", (updatedEditor: any) => {
    const updatedContent = updatedEditor?.editor?.getHTML();
    dispatch(setContent(updatedContent));
  });

  return (
    <>
      {/* main content (left and right panels columns) */}
      <div
        className={clsx(
          "flex flex-row w-full h-full overflow-hidden px-6 pt-6",
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
                  className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-10"
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
                  {/* <button
                      className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-10"
                      onClick={() => {
                        // generateStoryboard(editor);
                        dispatch(setScenes(storyboardSamples));
                        dispatch(setShowGeneratedStoryboard(true));
                      }}
                    >
                      Puuung samples (test)
                    </button> */}

                  {/* <button
                      className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-10"
                      onClick={() => {
                        dispatch(toggleShowChat());
                        // focus on text input chat-input
                        if (!entryHelper.showChat) {
                          chatInputRef.current?.focus();
                        }
                      }}
                    >
                      Chat
                    </button> */}
                </div>

                {entry?.scenes?.length === 0 && (
                  <>
                    {entryHelper.isGeneratingStoryboard ? (
                      <div className="flex flex-row gap-2 items-center h-8">
                        <Spinner speed={"0.8s"} className="w-4 h-4" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2 items-center h-8">
                        <button
                          className="text-accent h-10 rounded-full font-medium px-4 hover:bg-emerald-500 hover:bg-opacity-10"
                          onClick={() => {
                            generateStoryboard(editor);
                          }}
                        >
                          Generate
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <>
              {/* title and editor */}
              <div className="flex flex-col w-full h-full overflow-auto pb-52">
                {/* title */}
                <input
                  type="text"
                  id="title"
                  className="w-full py-5 bg-transparent outline-none text-6xl font-semibold text-[#0E100E] dark:text-[#E7FCE8] placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
                  value={entry?.title ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedTitle = e.target.value;
                    dispatch(setTitle(updatedTitle));
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    // press enter, if document with id "title" is focused, shift focus to editor
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // push content down one block and focus on the first block
                      editor?.commands.focus("start");
                    }

                    // if key is down arrow, focus on editor
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      editor?.commands.focus();
                    }
                  }}
                  placeholder="Title"
                />

                <>
                  <EditorContent
                    editor={editor}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      // if content is empty and user push backspace, focus on title

                      // or if user is on the first block of tiptip
                      if (
                        (e.key === "Backspace" || e.key === "ArrowUp") &&
                        editor?.isEmpty
                      ) {
                        // focus at the end of input
                        e.preventDefault();
                        const titleInput = document.getElementById(
                          "title"
                        ) as HTMLInputElement;
                        titleInput?.focus();
                        titleInput?.setSelectionRange(
                          titleInput.value.length,
                          titleInput.value.length
                        );
                      }
                    }}
                  />

                  {editor && (
                    <FloatingMenu
                      editor={editor}
                      tippyOptions={{ duration: 100 }}
                      className={clsx(
                        `flex flex-row w-[calc(48*${floatingMenus.length}px)] bg-light-background-primary dark:bg-dark-background-primary rounded-lg overflow-clip border border-light-divider dark:border-dark-divider drop-shadow-lg translate-y-[calc(50%+18px)] -translate-x-3 hidden`
                      )}
                    >
                      {floatingMenus.map((floatingMenu, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (floatingMenu.type === "image") {
                              floatingMenu.onClick(editor, () => {
                                setShowAddingImageModal(true);
                              });
                            } else {
                              floatingMenu.onClick(editor);
                            }
                          }}
                          className={clsx(
                            "flex flex-row items-center justify-center outline-none w-12 h-10 gap-2 focus:bg-light-background-secondary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
                            {
                              " text-accent bg-opacity-30 font-semibold":
                                floatingMenu.isActive(editor),
                            }
                          )}
                          id={`floating-menu-${index}`}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLButtonElement>
                          ) => {
                            // if hit tab, focus on next menu until the last one, then focus on the first one
                            if (e.key === "Tab") {
                              e.preventDefault();
                              document
                                .getElementById(
                                  `floating-menu-${
                                    (index + 1) % floatingMenus.length
                                  }`
                                )
                                ?.focus();
                            }
                          }}
                        >
                          {floatingMenu.icon}
                        </button>
                      ))}
                    </FloatingMenu>
                  )}

                  {editor && (
                    <BubbleMenu
                      editor={editor}
                      tippyOptions={{ duration: 100 }}
                      className="flex flex-row bg-light-background-primary dark:bg-dark-background-primary drop-shadow-md border border-light-divider dark:border-dark-divider h-8"
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
            </>
          </div>
        </div>

        {/* right panel */}
        <div
          id="right-panel-scroll"
          className={clsx(
            "flex flex-col h-full items-center duration-300 gap-4 flex-shrink-0 overflow-auto",
            { "w-0 opacity-0": !entryHelper.showGeneratedStoryboard },
            { "w-[400px]": entryHelper.showGeneratedStoryboard }
          )}
        >
          <div className="flex flex-col w-full h-full gap-3">
            <div className="flex flex-col w-full gap-10 max-xl:flex max-xl:flex-col flex-1">
              {entry?.scenes.map(
                (scene: Scene & StoryboardSample, index: number) => (
                  <div
                    key={index}
                    className="group relative flex flex-col w-full h-auto rounded-none overflow-clip bg-light-background-tertiary dark:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider min-w-[400px] pb-4"
                  >
                    <div className="flex flex-col">
                      <img
                        src={scene.image_url}
                        // src={
                        //   imageVariants.find((iv) => iv.sceneIndex === index)
                        //     ?.selectedVariantIndex !== undefined &&
                        //   imageVariants.find((iv) => iv.sceneIndex === index)
                        //     ?.variants[
                        //     imageVariants.find((iv) => iv.sceneIndex === index)
                        //       ?.selectedVariantIndex!
                        //   ] !== undefined
                        //     ? `data:image/png;base64,${
                        //         imageVariants.find(
                        //           (iv) => iv.sceneIndex === index
                        //         )?.variants[
                        //           imageVariants.find(
                        //             (iv) => iv.sceneIndex === index
                        //           )?.selectedVariantIndex!
                        //         ]
                        //       }`
                        //     : scene?.image_base64
                        //     ? "data:image/png;base64," + scene.image_base64
                        //     : ""
                        // }
                        alt="comic book cover"
                        className="object-cover aspect-[4/3]"
                      />

                      {/* image variants */}
                      {(imageVariants.find((iv) => iv.sceneIndex === index) ||
                        currentVariantsProcessThread.find(
                          (iv) => iv.sceneIndex === index
                        )?.isGenerating) && (
                        // image variants
                        <div className="flex flex-row w-full h-20 p-2 gap-2">
                          {currentVariantsProcessThread.find(
                            (iv) => iv.sceneIndex === index
                          )?.isGenerating ? (
                            // map 4 times
                            Array.from(Array(4).keys()).map((_, imageIndex) => (
                              <div
                                key={imageIndex}
                                className={clsx(
                                  "w-full h-full aspect-square bg-light-background-secondary dark:bg-dark-background-secondary rounded-md overflow-clip animate-pulse"
                                )}
                              />
                            ))
                          ) : (
                            <>
                              {imageVariants
                                .find((iv) => iv.sceneIndex === index)
                                ?.variants.map((variant, imageIndex) => (
                                  <button
                                    key={imageIndex}
                                    onClick={() => {
                                      handleVariantClick(index, imageIndex);
                                    }}
                                    className={clsx(
                                      "relative w-full h-full rounded-lg overflow-clip",
                                      {
                                        "ring-1 ring-emerald-500":
                                          imageVariants.find(
                                            (iv) => iv.sceneIndex === index
                                          )?.selectedVariantIndex ===
                                          imageIndex,
                                      }
                                    )}
                                  >
                                    <img
                                      src={`data:image/png;base64,${variant}`}
                                      alt={`comic variant image ${
                                        imageIndex + 1
                                      }`}
                                      className={clsx(
                                        "w-full h-full object-cover aspect-square"
                                        // { "opacity-30 dark:opacity-30 brightness-[0.7]" : imageIndex !== 2}
                                      )}
                                    />

                                    {/* overlay */}
                                    {imageVariants.find(
                                      (iv) => iv.sceneIndex === index
                                    )?.selectedVariantIndex === imageIndex && (
                                      <div className="absolute flex inset-0 bg-[rgb(0,0,0,0.5)] dark:bg-[rgb(0,0,0,0.6)] w-full h-full items-center justify-center">
                                        <FiCheckCircle className="text-emerald-500 text-xl" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="absolute flex flex-row w-full items-center justify-between p-2">
                      {currentVariantsProcessThread.find(
                        (iv) => iv.sceneIndex === index
                      )?.isGenerating ? (
                        <div className="flex flex-row px-3 h-8 rounded-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-xl text-sm font-medium text-dark-text-primary borderborder-dark-dividerContrast">
                          <Spinner className="w-3 h-3 mr-2" />
                          Creating variants...
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            handleGenerateImagesVariants(index);
                          }}
                          className="flex flex-row px-3 h-8 rounded-full items-center justify-center bg-emerald-500 bg-opacity-80 backdrop-blur-xl text-sm font-medium text-dark-text-primary borderborder-dark-dividerContrast"
                        >
                          Create variants
                        </button>
                      )}

                      <button
                        className="flex w-8 h-8 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary text-white rounded-full items-center justify-center"
                        onClick={() => handleDeleteScene(index)}
                      >
                        <FiX className="text-light-text-secondary dark:text-dark-text-secondary" />
                      </button>
                    </div>

                    <div className="flex p-4 flex-grow flex-col">
                      {editingSceneIndex === index ? (
                        <>
                          <textarea
                            className="w-full mb-2 rounded"
                            style={{
                              flex: "1",
                              minHeight: "8em",
                              backgroundColor: "inherit",
                            }}
                            value={newSceneText}
                            onChange={(e) => setNewSceneText(e.target.value)}
                          />
                          <div className="absolute left-0 right-0 bottom-0 flex justify-between items-center p-2">
                            <button
                              className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                              onClick={() => handleRevertScene(index)}
                            >
                              Revert
                            </button>
                            <button
                              className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                              onClick={() => handleSaveScene(index)}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[4]">
                          {scene?.prompt || scene?.text || ""}
                        </p>
                      )}

                      {/* Edit button */}
                      {editingSceneIndex !== index && (
                        <button
                          className="absolute bottom-0 right-0 mb-4 mr-2 w-6 h-6 text-light-text-primary dark:text-dark-text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-150 ease-in-out"
                          onClick={() => handleEditScene(index)}
                        >
                          <FiEdit2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {isGeneratingCustomScene && (
                <div className="flex flex-row gap-6 w-full aspect-square bg-light-background-secondary dark:bg-dark-background-secondary items-center justify-center animate-pulse p-6 text-light-text-secondary dark:text-dark-text-secondary text-center">
                  {/* <Spinner className="w-5 h-5 flex-shrink-0" /> */}
                  <p>
                    Generating new scene with prompt: <br />
                    <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {customPromptText}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* regenerate container */}
            <form className="flex flex-col sticky bottom-0 w-full gap-3 border border-light-divider dark:border-dark-divider rounded-t-xl p-3 bg-light-background-secondary dark:bg-dark-background-secondary bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl">
              <input
                value={customPromptText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCustomPromptText(e.target.value);
                }}
                placeholder="Enter new scene prompt..."
                className="placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary h-12 border border-light-dividerContrast dark:border-dark-dividerContrast outline-none p-3 rounded-lg focus:ring-1 ring-emerald-500 disabled:opacity-50 bg-light-background-secondary dark:bg-dark-background-secondary"
                disabled={isGeneratingCustomScene}
              />

              <button
                type="submit"
                onClick={() => {
                  rightPanelScrollToBottom();
                  setIsGeneratingCustomScene(true);
                  addSceneFromCustomPrompt(customPromptText)
                    .then(() => {
                      rightPanelScrollToBottom();
                      setCustomPromptText("");
                    })
                    .catch((err) => {
                      console.log(
                        "Failed to add scene from custom prompt",
                        err
                      );
                    })
                    .finally(() => {
                      setIsGeneratingCustomScene(false);
                    });
                }}
                disabled={customPromptText === "" || isGeneratingCustomScene}
                className="flex flex-row w-full items-center justify-center h-12 bg-light-background-tertiary dark:bg-dark-background-tertiary flex-shrink-0 rounded-xl hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary transition-all border border-light-divider dark:border-dark-divider hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:transition-all"
              >
                {isGeneratingCustomScene ? (
                  <div className="flex flex-row items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <FiPlus />
                    Add Scene with Custom Prompt
                  </div>
                )}
              </button>
            </form>
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
  // {
  //   type: "codeBlock",
  //   label: "Code Block",
  //   icon: <FiCode />,
  //   onClick: (editor: Editor) =>
  //     editor?.chain().focus().toggleCodeBlock().run(),
  //   isActive: (editor: Editor) => editor?.isActive("codeBlock"),
  // },
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
  //image
  {
    type: "image",
    label: "Image",
    icon: <FiImage />,
    onClick: (editor: Editor, setShowAddingImageModal?: () => void) => {
      if (setShowAddingImageModal) {
        setShowAddingImageModal();
      }
    },
    isActive: (editor: Editor) => editor?.isActive("image"),
  },
];

const floatingMenus = bubbleMenus.filter((menu) => {
  return menu.type !== "bold" && menu.type !== "italic";
});
