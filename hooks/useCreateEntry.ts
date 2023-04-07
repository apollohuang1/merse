import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { JSONContent } from "@tiptap/react";
import axios, { AxiosResponse } from "axios";
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import React from "react";

// Hook for creating new entries
const useEntryCreate = () => {
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = React.useState<boolean>(false);

  // redux states
  const entry = useAppSelector((state) => state.entry);
  const dispatch = useAppDispatch();

  const stopGeneratingStoryboard = () => {
    setIsGeneratingStoryboard(false);
    // more code on handling stop generating storyboard
  };

  const generateStoryboard = async (editor: any) => {
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

  //gpt3.5 API
  const createChatCompletion = async (input: string) => {
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      //const control_prompt = "For the \"TEXT\" below, generate content for a graphic novel in the following \"FORMAT\":\nFORMAT:\nPanel 1:\n (Scene: make sure the description is detailed of roughly 100 words, formatted as a text-to-image prompt input.) \nDialogue: should be labeled by which character is speaking WITHOUT parentheses. \nTEXT: " + input;

      const control_prompt =
        'For the "TEXT_STORY" below, generate content for a graphic novel in the following "FORMAT":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed) \nDialogue: should be labeled (without parantheses) by which character is speaking. \nTEXT_STORY: ' +
        input;

      const requestData: CreateChatCompletionRequest = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: control_prompt }],
        temperature: 0.7,
      };

      const openAIResponse: AxiosResponse<CreateChatCompletionResponse> =
        await axios({
          method: "POST",
          url: "https://api.openai.com/v1/chat/completions",
          data: requestData,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
        });

      // console.log(response.data);
      const generatedText = openAIResponse?.data?.choices[0]?.message?.content;

      // guard if generated text is null
      if (!generatedText || generatedText === "") {
        throw new Error("Generated text is null");
      }

      console.log("🎉 We did it!");
      console.log(generatedText);

      const sceneText = stripText(generatedText);

      console.log("###--------------------SCENES--------------------###");
      console.log(sceneText);

      let splittedSceneText = sceneText
        .split("\n")
        .filter((line) => line.startsWith("Scene: "))
        .map((line) => line.substring("Scene: ".length).trim());

      // comment this out to generate only 1 image
      createImageFromText(splittedSceneText[0]);


      // 🚨 Comment this out to generate the entire storyboard. This will burn a lot of the API quota.
      // iterate through splitedSceneText array
      // for (let i = 0; i < splittedSceneText.length; i++) {
      // createImageFromText(splittedSceneText[);
      // }

      stopGeneratingStoryboard();
      return sceneText;
    } catch (error: any) {
      stopGeneratingStoryboard();
      console.log(
        `Failed to create chat completion from http request, message: ${error?.message}`
      );
      return null;
    }
  };

  //new--------------------------------------
  //stable diffusion text-to-image API
  //change this later such that it iterates through EACH panel
  const createImageFromText = async (input: string) => {
    try {

      if (!input || input === "") {
        throw new Error("Input text is null");
      }

      const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
      const formattedPromptWithStyle = `${input} in ${entry.style_reference.artist} artstyle`;

      const response = await axios({
        method: "POST",
        url: "/api/text2image",
        data: {
          prompt: formattedPromptWithStyle,
        },
        headers: { "Content-Type": "application/json" },
      });

      console.log("Stable Diffusion API Response: ");
      console.log(response.data);

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

  return {
    isGeneratingStoryboard,
    generateStoryboard,
    createImageFromText,
  };
};

export default useEntryCreate;
