"use client";

import CreateHeader from "@/components/create/create-header";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  FiArrowUp,
  FiBold,
  FiCode,
  FiEdit2,
  FiImage,
  FiItalic,
  FiList,
  FiMoreHorizontal,
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
import { Spinner } from "@chakra-ui/react";

// import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import {
  StoryboardSample,
  createRoutes,
  storyboardSamples,
} from "@/util/constants/create-constants";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  addChatMessage,
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
import Spotify from "@/tiptap/extensions/Spotify";

import openai, {
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";
import { Transition } from "@headlessui/react";


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
  const { generateStoryboard } = useCreateEntry();

  // redux states
  const auth = useAppSelector((state) => state.auth);
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const dispatch = useAppDispatch();
  

  // edit storyboard scene text
  const [editingSceneIndex, setEditingSceneIndex] = useState<number | null>(null);
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

  const [isEnterPressed, setIsEnterPressed] = React.useState<boolean>(false);

  // Set up the Hocuspocus WebSocket provider
  // const provider = new HocuspocusProvider({
  //   url: "ws://127.0.0.1:1234",
  //   name: "example-document",
  // });

  const handleEditScene = (index: number) => {
    // Set the index of the scene being edited
    setEditingSceneIndex(index);
    // Set the newSceneText to be the original text of the scene
    const originalText = entry.scenes[index]?.displayed_text || entry.scenes[index]?.text || "";
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
    editorProps: {
      attributes: {
        class:
          "outline-none w-full h-full bg-transparent min-h-[calc(100vh-300px)] highlight selection:bg-[#3cc9a3] selection:bg-opacity-25",
      },
    },
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

  const handleSendMessage = async () => {
    try {
      // people who are allowed to generate storyboards
      const manualWhitelistedEmails = [
        "markrachapoom@gmail.com",
        "emily.park@berkeley.edu",
        "jyoti.rani@berkeley.edu",
      ];

      if (!manualWhitelistedEmails.includes(auth?.currentUser?.email)) {
        // alert to let people know we're still developing
        alert(
          "Sorry, we're still developing this feature. We will let you know when it's ready!"
        );
        throw new Error("User not whitelisted");
      }
      setIsChatResponseLoading(true);

      // add new message to chatMessages array
      const newChatMessage: openai.ChatCompletionRequestMessage = {
        role: "user",
        content: chatInputText,
      };

      dispatch(addChatMessage(newChatMessage));
      setChatInputText("");
      scrollToChatBottom();

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY as string,
      });

      const openAIAPI = new OpenAIApi(configuration);

      // {"role": "system", "content": "You are a helpful assistant."},
      const systemMessage: openai.ChatCompletionRequestMessage = {
        role: "system",
        content:
          "You are a compassionate AI companion, dedicated to helping users reflect on their day and providing a supportive space. Your vast knowledge of human nature and empathetic nature make you the perfect listener and therapist. Begin the conversation by gently asking users about their day, showing genuine interest in their emotions and experiences. Remember, some may find it challenging to express themselves, so use open-ended questions to help them explore their feelings further. Your goal is to make users feel good, offering kind and understanding responses. At the end of the chat session, surprise them by generating a tiptap storyboard summarizing the highlights of their day. With your caring presence and insightful conversations, you can create a meaningful and uplifting experience for every user you engage with." +
          "User's name is: " +
          (auth?.currentUser?.name as string).split(" ")[0] +
          ". When user ask you to summarize, act as if you're them writing down about their day and the language should be in first person.",
      };

      const completionResponse = await openAIAPI.createChatCompletion({
        model: "gpt-3.5-turbo",
        // messages: [...chatMessages, { role: "user", content: chatInputText}],
        messages: [systemMessage, ...entry?.chat_messages, newChatMessage],
        temperature: 0.7,
      });

      const responseMessage =
        completionResponse.data.choices[0].message?.content;

      if (!responseMessage) return;

      dispatch(addChatMessage({ role: "assistant", content: responseMessage }));

      setIsChatResponseLoading(false);

      scrollToChatBottom();

      // setChatInputText("");
    } catch (error: any) {
      setIsChatResponseLoading(false);
      console.log(error);
    }
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
      editor?.commands.setContent(entry?.content)
    }
  }, [editor])


  editor?.on("update", (updatedEditor: any) => {
    const updatedContent = updatedEditor?.editor?.getHTML();
    dispatch(setContent(updatedContent));
  });

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-auto">
        {/* navigation header */}
        <CreateHeader currentRoute={createRoutes[2]} nextDisabled={entry?.title === "" || !entry?.content} />

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
                </div>
              </div>

              {entryHelper?.showChat ? (
                <div className="flex flex-col w-full h-full overflow-auto">
                  {/* <div className="w-full h-full bg-sky-200"> */}
                  <div
                    id="chat-content"
                    className="flex flex-col w-full h-full gap-3 overflow-auto"
                  >
                    {entry?.chat_messages.map(
                      (
                        message: openai.ChatCompletionRequestMessage,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className={clsx(
                            "flex flex-row w-full p-3 gap-2",
                            { "justify-end": message.role === "user" },
                            { "justify-start": message.role === "assistant" }
                          )}
                        >
                          <div
                            className={clsx(
                              "flex px-4 py-2 h-auto items-center justify-center max-w-[60%]",
                              {
                                "bg-light-background-secondary dark:bg-dark-background-secondary rounded-t-2xl rounded-br-2xl":
                                  message.role === "assistant",
                              },
                              {
                                "bg-emerald-500 dark:bg-emerald-500 text-white rounded-t-2xl rounded-bl-2xl":
                                  message.role === "user",
                              }
                            )}
                          >
                            {message.content}
                          </div>

                          {/* {auth?.currentUser?.profile_image_url &&
                            message.role === "user" && (
                              <img
                                src={auth?.currentUser?.profile_image_url}
                                alt="profile"
                                className="w-8 h-8 rounded-full"
                              />
                            )} */}
                        </div>
                      )
                    )}

                    {isChatResponseLoading && (
                      <div className="flex flex-row w-full p-3 gap-2 justify-start">
                        <div
                          className={
                            "flex px-4 py-2 h-auto items-center justify-center max-w-[60%] bg-light-background-secondary dark:bg-dark-background-secondary animate-pulse rounded-t-2xl rounded-br-2xl"
                          }
                        >
                          <FiMoreHorizontal className="w-8 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row w-full py-3">
                    <div className="flex flex-row items-center gap-4 border border-light-dividerContrast dark:border-dark-dividerContrast w-full h-12 rounded-full pl-4 pr-2 py-2">
                      <input
                        type="text"
                        ref={chatInputRef}
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setIsEnterPressed(true);
                          }
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setIsEnterPressed(false);

                            if (
                              chatInputText &&
                              isChatResponseLoading === false
                            ) {
                              handleSendMessage();
                            }
                          }
                        }}
                        placeholder="Type a message..."
                        className="w-full h-full outline-none bg-transparent text-light-text-primary dark:text-dark-text-primary"
                      />

                      {/* <button
                        className="text-emerald-500 text-sm font-semibold disabled:opacity-50"
                        disabled={chatInputText.length === 0}
                      >
                        Send
                      </button> */}

                      <button
                        onClick={() => {
                          if (chatInputText) {
                            handleSendMessage();
                          }
                        }}
                        className={clsx(
                          "flex bg-emerald-500 h-full rounded-full aspect-square items-center justify-center disabled:opacity-50",
                          { "opacity-50": isChatResponseLoading },
                          { "scale-95": isEnterPressed },
                          { "scale-100": !isEnterPressed }
                        )}
                        disabled={chatInputText.length === 0}
                      >
                        <FiArrowUp className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
                        // press enter, shife focus to editor
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
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
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
                            `flex flex-row w-[calc(48*${floatingMenus.length}px)] bg-light-background-primary dark:bg-dark-background-primary rounded-lg overflow-clip border border-light-divider dark:border-dark-divider drop-shadow-lg translate-y-[calc(50%+18px)] -translate-x-3`
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
                                },
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
                              {/* <span>{floatingMenu.label}</span> */}
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
              )}
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
            {entry?.scenes.map((scene: Scene & StoryboardSample, index: number) => (
              <div
                key={index}
                className="group relative flex flex-col w-full rounded-lg overflow-clip bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider aspect-auto min-w-[400px] pb-4"
              >
                <img
                  src={
                    scene?.image_base64
                      ? "data:image/png;base64," + scene.image_base64
                      : scene?.artwork?.url ?? ""
                  }
                  alt="comic book cover"
                  className="object-cover aspect-[4/3]"
                />

                <div className="flex p-4 flex-grow flex-col bg-light-background-secondary dark:bg-dark-background-secondary">
                  {editingSceneIndex === index ? (
                    <>
                      <textarea
                        className="w-full mb-2 rounded"
                        style={{flex: '1', minHeight: '6em', backgroundColor: 'inherit'}}
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
                      {scene?.displayed_text || scene?.text || ""}
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
            ))}

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
