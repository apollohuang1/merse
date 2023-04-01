"use client";

import CreateHeader from "@/components/create/create-header";
import React from "react";
import { FiEdit2, FiImage, FiList, FiType } from "react-icons/fi";
import { TbHeading } from "react-icons/tb";
import { createRoutes } from "../layout";

import {
  useEditor,
  EditorContent,
  FloatingMenu,
  JSONContent,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
// import DropCursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";

// ChakraUI
import { Spinner } from '@chakra-ui/react'

// import editorStyles from "../../../styles/editor.module.css";
import clsx from "clsx";
import Modal from "@/components/modal";
import Placeholder from "@tiptap/extension-placeholder";
import { storyboardSamples } from "@/util/create-samples";

// OpenAI and requests
import {
  Configuration,
  OpenAIApi,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import axios, { AxiosResponse } from "axios";

type Props = {};

const Storyboard = (props: Props) => {
  const [showAddingImageModal, setShowAddingImageModal] =
    React.useState<boolean>(false);
  const [addingImageURL, setAddingImageURL] = React.useState<string>("");
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] =
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
        placeholder: "Write your storyboard here...",
        emptyEditorClass: "is-editor-empty",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {},
      }),
      // DropCursor.configure({
      //   color: "#10b981",
      //   width: 2,
      //   class: " rounded-full transition-all",
      // }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none w-full h-full min-h-screen",
      },
    },
    // content: "<h1>Hello World! 🌎️</h1>",
  });

  const generateStoryboard = async () => {
    try {
      if (editor) {
        setIsGeneratingStoryboard(true);
        const editorJSON = editor.getJSON();
        const textContent = convertTiptapJSONToText(editorJSON);
        await createChatCompletion(textContent);
        // const prompt = await generatePromptFromChatGPT(textContent);
        console.log("🎉");
        console.log(textContent);
        return;
      } else {
        // handle blank editor
        setIsGeneratingStoryboard(false);
        console.log("editor is null");
      }
    } catch (error: any) {
      setIsGeneratingStoryboard(false);
      console.log(`Failed to generate storyboard, message: ${error?.message}`);
    }
  };


  const stopGeneratingStoryboard = () => {
    setIsGeneratingStoryboard(false);
    // more code on handling stop generating storyboard
  }

  //gpt3.5 API
  const createChatCompletion = (input: string) => {
    try {
      const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      //const control_prompt = "For the \"TEXT\" below, generate content for a graphic novel in the following \"FORMAT\":\nFORMAT:\nPanel 1:\n (Scene: make sure the description is detailed of roughly 100 words, formatted as a text-to-image prompt input.) \nDialogue: should be labeled by which character is speaking WITHOUT parentheses. \nTEXT: " + input;
      const control_prompt = "For the \"TEXT_STORY\" below, generate content for a graphic novel in the following \"FORMAT\":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed) \nDialogue: should be labeled (without parantheses) by which character is speaking. \nTEXT_STORY: " + input;
      const requestData: CreateChatCompletionRequest = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: control_prompt }],
        temperature: 0.7,
      };

      axios({
        method: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        data: requestData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      })
        .then((response: AxiosResponse<CreateChatCompletionResponse>) => {
          // console.log(response.data);
          const generatedText = response?.data?.choices[0]?.message?.content;
          // guard if generated text is null
          if (!generatedText) {
            stopGeneratingStoryboard();
            return;
          }

          console.log("🎉 We did it!");
          console.log(generatedText);

          // new--------------------------------------------------------
          // Strip scenes out
          // Strip scenes out
          const stripText = (input: string) => {
            const regex = /\(([^)]+)\)/g;
            const paragraphs = input.split(/\r?\n/);
            let matches = [];
            let currentPanel = "";
            let dialogueText = ""; //new empty var
            for (const paragraph of paragraphs) {
              const panelMatch = /^Panel\s+\d+:/gi.exec(paragraph);
              if (panelMatch) {
                currentPanel = panelMatch[0].trim();
              } else {
                const match = regex.exec(paragraph);
                if (match && currentPanel !== "") {
                  const matchText = match[1].trim();
                  matches.push(`${currentPanel}\n${matchText}`);
                } 
              }
            }
            return matches.join("\n");
          };
          
          const sceneText = stripText(generatedText);
          console.log("###--------------------SCENES--------------------###");
          //createImageFromText(sceneText);
          console.log(sceneText);
          createImageFromText(sceneText);
          //new--------------------------------------------------------

          console.log(response.data)
          stopGeneratingStoryboard();
          return
        })
        .catch((error) => {
          stopGeneratingStoryboard();
          console.log(
            `Failed to create chat completion from http request, message: ${error?.message}`
          );
        });
    } catch (error: any) {
      stopGeneratingStoryboard();
      console.log(
        `Failed to create chat completion, message: ${error?.message}`
      );
    }
  };

//new--------------------------------------
  //stable diffusion text-to-image API
  //change this later such that it iterates through EACH panel
  const createImageFromText = (input: string) => {
    try {
        //console.log("-:1");
        const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
        const requestData = {
            text: input, //input
            device: "cpu",
            output_format: "url",
            output_size: "1024x1024",
        };
        axios({
            method: "POST",
            url: "https://stablediffusionapi.com/api/v3/text2img",
            data: requestData,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${stableDiffusionApiKey}`,
            },
        })
        .then((response: AxiosResponse) => {
            //console.log("-:5");
            console.log(response.data);
            const imageUrl = response?.data?.output_url;
            if (!imageUrl) {
                console.log("Failed to generate image: no output URL provided.");
                return;
            }
            console.log("🖼️ Image URL:", imageUrl);
        })
        .catch((error) => {
            console.log("Failed to generate image:", error);
        });
    } catch (error: any) {
        console.log("Failed to generate image:", error?.message);
    }
};
//new--------------------------------------^^

  const convertTiptapJSONToText = (tiptapJSON: JSONContent): string => {
    const { content } = tiptapJSON;
    let text = "";

    content?.forEach((node: any) => {
      if (node.type === "text") {
        text += node.text;
      } else if (node.type === "image") {
        // Include the image source as part of the text
        text += `[IMAGE: ${node.attrs.src}]`;
      } else if (node.content) {
        text += convertTiptapJSONToText(node);
      }
    });

    return text;
  };

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
              "flex flex-col w-full h-full overflow-auto bg-light-background-secondary bg-opacity-30 dark:bg-opacity-70 dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider rounded-t-lg"
              // editorStyles.editor
            )}
          >
            <div className="flex flex-row w-full bg-light-background-secondary dark:bg-dark-background-secondary items-center justify-between border-b border-b-light-divider dark:border-b-dark-divider p-2">

              {/* editor toolbar */}
              {/* <></> */}
              <div className="flex flex-row"></div>

              { isGeneratingStoryboard ? (
                <div className="flex flex-row gap-2 items-center h-8">
                  <Spinner speed={"0.8s"} className="w-4 h-4" />
                  <span className="text-sm">Generating...</span>
                </div>
              ) : (
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 h-8 rounded-full text-sm font-medium"
                  onClick={() => {
                    generateStoryboard();
                  }}
                >
                  Generate
                </button>
              )}
            </div>

            <div className="w-full h-full overflow-auto p-7">
              {/* <EditorContent editor={editor} className={editorStyles.editor} /> */}
              <EditorContent editor={editor} />

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
                      "flex flex-row items-center justify-start outline-none h-12 gap-2 p-4 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
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

              {editor && (
                <BubbleMenu
                  editor={editor}
                  tippyOptions={{ duration: 100 }}
                  className="flex flex-row bg-light-background-primary dark:bg-dark-background-primary rounded-lg drop-shadow-2xl border border-light-divider dark:border-dark-divider h-8"
                >
                  <button
                    onClick={() =>
                      editor.chain().focus().setHeading({ level: 1 }).run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider pl-2",
                      {
                        " text-emerald-500 bg-opacity-30": editor.isActive(
                          "heading",
                          { level: 1 }
                        ),
                      }
                    )}
                  >
                    H1
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().setHeading({ level: 2 }).run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider pl-2",
                      {
                        " text-emerald-500 bg-opacity-30": editor.isActive(
                          "heading",
                          { level: 2 }
                        ),
                      }
                    )}
                  >
                    H2
                  </button>

                  <button
                    onClick={() =>
                      editor.chain().focus().setHeading({ level: 3 }).run()
                    }
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider pl-2",
                      {
                        " text-emerald-500 bg-opacity-30": editor.isActive(
                          "heading",
                          { level: 3 }
                        ),
                      }
                    )}
                  >
                    H3
                  </button>

                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider pl-2",
                      {
                        " text-emerald-500 bg-opacity-30":
                          editor.isActive("bold"),
                      }
                    )}
                  >
                    bold
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        " text-emerald-500 bg-opacity-30":
                          editor.isActive("italic"),
                      }
                    )}
                  >
                    italic
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={clsx(
                      "flex flex-row items-center justify-start outline-none gap-2 px-1 focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider",
                      {
                        " text-emerald-500 bg-opacity-30":
                          editor.isActive("strike"),
                      }
                    )}
                  >
                    strike
                  </button>
                </BubbleMenu>
              )}
            </div>
          </div>

          {/* storyboard list right panel */}
          <div className="flex flex-col w-full h-full overflow-auto rounded-lg">
            <div className="grid grid-cols-2 w-full gap-4 max-xl:flex max-xl:flex-col">
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
                    <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[8]">
                      {style?.description}
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. */}
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
