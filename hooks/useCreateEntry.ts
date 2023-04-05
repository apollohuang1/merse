import { JSONContent } from "@tiptap/react";
import axios, { AxiosResponse } from "axios";
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import React from "react";

// Hook for creating new entries
const useEntryCreate = () => {
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] =
    React.useState<boolean>(false);

  const stopGeneratingStoryboard = () => {
    setIsGeneratingStoryboard(false);
    // more code on handling stop generating storyboard
  };

  const generateStoryboard = (editor: any) => {
    try {
      if (editor) {
        setIsGeneratingStoryboard(true);
        const editorJSON = editor.getJSON();
        const textContent = convertTiptapJSONToText(editorJSON);
        createChatCompletion(textContent);
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

  //new--------------------------------------
  //stable diffusion text-to-image API
  //change this later such that it iterates through EACH panel
  const createImageFromText = (input: string) => {
    //console.log("-:1");
    const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
    console.log("Key: " + stableDiffusionApiKey);
    const requestData = {
      key: stableDiffusionApiKey,
      text: input, //input
      // device: "cpu",
      // output_format: "url",
      // output_size: "1024x1024",
      width: "1024",
      height: "1024",
      samples: "1",
      enhance_prompt: "yes",
      seed: null,
    };

    axios({
      method: "POST",
      url: "https://stablediffusionapi.com/api/v3/text2img",
      data: requestData,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${stableDiffusionApiKey}`,
        'Access-Control-Allow-Origin': 'http://localhost:3000'
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
      console.log("Failed to generate image:", error?.message);
    });
  };
  //new--------------------------------------^^

  //gpt3.5 API
  const createChatCompletion = (input: string) => {
    try {
      const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      //const control_prompt = "For the \"TEXT\" below, generate content for a graphic novel in the following \"FORMAT\":\nFORMAT:\nPanel 1:\n (Scene: make sure the description is detailed of roughly 100 words, formatted as a text-to-image prompt input.) \nDialogue: should be labeled by which character is speaking WITHOUT parentheses. \nTEXT: " + input;
      const control_prompt =
        'For the "TEXT_STORY" below, generate content for a graphic novel in the following "FORMAT":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed) \nDialogue: should be labeled (without parantheses) by which character is speaking. \nTEXT_STORY: ' +
        input;

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

          console.log(response.data);
          stopGeneratingStoryboard();
          return;
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

  return {
    isGeneratingStoryboard,
    generateStoryboard,
    createImageFromText
  };
};

export default useEntryCreate;
