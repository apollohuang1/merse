import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { JSONContent } from "@tiptap/react";
import axios, { AxiosResponse } from "axios";
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import React from "react";
import * as $ from "jquery";
import * as base64 from 'base64-js';
import * as fs from 'fs';
import { setShowGeneratedStoryboard } from "@/redux-store/store";

// Hook for creating new entries
const useCreateEntry = () => {

  // scene model
  interface Scene {
    image_url: string;
    text: string;
  }

  const [generatedScenes, setGeneratedScenes] = React.useState<Scene[]>([]);

  const [isGeneratingStoryboard, setIsGeneratingStoryboard] =
    React.useState<boolean>(false);

  // redux states
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const stopGeneratingStoryboard = () => {
    setIsGeneratingStoryboard(false);
    // more code on handling stop generating storyboard
  };

  const saveEntry = async () => {
    console.log("Saving entry...");

    try {
      const response = await axios({
        method: "POST",
        url: "/api/entries",
        data: entry,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Successfully saved entry");
      
      console.log(response);
    } catch (error: any) {
      console.log(`Failed to save entry, message: ${error?.message}`);
    }
  };

  const generateStoryboard = async (editor: any) => {
    try {
      // guard log in to prevent anonymous users from burning our API credits
      if (auth?.currentUser === null) {
        alert(
          "🚨 Please log in to generate a storyboard.\n\nFor now, you can browse and play around without logging in, but you won't be able to save your work or use AI to generate images :))"
        );
        throw new Error("User not logged in");
      }

      const manualWhitelistedEmails = [
        "markrachapoom@gmail.com",
        "emily.park@berkeley.edu",
        "jyoti.rani@berkeley.edu"
      ]

      if (!manualWhitelistedEmails.includes(auth?.currentUser?.email)) {
        alert(
          "🚨 Sorry, you're not whitelisted to use the AI yet. Please ping one of us to get access."
        );
        throw new Error("User not whitelisted");
      }

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


  const createImageFromText = async (input: string) => {
    let base_64 = "";
    let dataUrl = "";
    try {
      // stable diffusion
      const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
      const engineId = "stable-diffusion-v1-5";
      const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
      const apiKey = process.env.STABILITY_API_KEY;

      // guards
      if (!apiKey) {
        throw new Error("Missing Stability API key.");
      }
      if (!input || input === "") {
        throw new Error("Input text is null");
      }
      if (entry?.style_reference?.artist === null) {
        throw new Error("Entry style reference is null");
      }

      // final input prompt
      const formattedPromptWithStyle = `${input} in ${entry?.style_reference?.artist} comic illustration artstyle`;
      // Response of NEW Stable Diffusion XL
      const sdxlResponse = await axios({
        method: "POST",
        url: `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
        data: {
          text_prompts: [
            {
              // text: "A lighthouse on a cliff",
              text: formattedPromptWithStyle,
            },
          ],
          cfg_scale: 7,
          clip_guidance_preset: "FAST_BLUE",
          height: 512,
          width: 512,
          samples: 1,
          steps: 30,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const artifactsResponse: GenerationResponse = sdxlResponse?.data?.artifacts;
      if (artifactsResponse) {
        const artifacts = artifactsResponse.artifacts; // Extract artifacts array from the response
        // Check if artifacts is not null or undefined
        if (artifacts) {
          const length = artifacts.length; 
          for (let i = 0; i < length + 1; i++) {
            const image = artifacts[i];
          }
        }
      }
      console.log("SDXL RESPONSE:");
      console.log(sdxlResponse.data);

      base_64 = sdxlResponse?.data?.artifacts[0].base64;
      const image_data = Buffer.from(base_64, 'base64');      
      dataUrl = `data:image/png;base64,${image_data.toString('base64')}`;

      const newScene: Scene = {
        text: input,
        image_url: dataUrl,
      }

      appendGeneratedScene(newScene);
      dispatch(setShowGeneratedStoryboard(true));

      interface GenerationResponse {
        artifacts: Array<{
          base64: string;
          seed: number;
          finishReason: string;
        }>;
      }
    } catch (error: any) {
      console.log(error);
      console.log("Failed to generate image:", error?.message);
    }
  };


  const appendGeneratedScene = (scene: Scene) => {
    setGeneratedScenes((prev) => [...prev, scene]);
  }


  const convertTiptapJSONToText = (tiptapJSON: JSONContent): string => {
    const { content } = tiptapJSON;
    let text = "";
    const length = content?.length || 0;
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
    generatedScenes,
    createImageFromText,
    saveEntry,
  };
};



export default useCreateEntry;

// ❤️ Hiii Emily! Would you kindly add the code to handle the response from the API here please?
// It'd be so lovely! Thank you so much! :)))) <3

// Sample of Stable Diffusion API Response (response.data) after POST request to /api/text2image:
// you can see there's ETA for posting request to fetch_result too  :))))
// the post request should use that fetch_result as a POST request url and {key: [api_key] } object as data payload

// {
//   "status": "processing",
//   "tip": "for faster speed, keep resolution upto 512x512",
//   "eta": 35.941116006399994,
//   "messege": "Try to fetch request after given estimated time",
//   "fetch_result": "https://stablediffusionapi.com/api/v3/fetch/10684517",
//   "id": 10684517,
//   "output": [],
//   "meta": {
//       "H": 512,
//       "W": 512,
//       "enable_attention_slicing": "true",
//       "file_prefix": "7da15755-b94b-4347-a195-ac8725a7ee97",
//       "guidance_scale": 7,
//       "model": "runwayml/stable-diffusion-v1-5",
//       "n_samples": 1,
//       "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs))",
//       "outdir": "out",
//       "prompt": "A dark alleyway at night with trash cans overflowing and rats scurrying about. In the foreground, we see the silhouette of a figure approaching. in Hergé artstyle",
//       "revision": "fp16",
//       "safetychecker": "no",
//       "seed": 3525930829,
//       "steps": 20,
//       "vae": "stabilityai/sd-vae-ft-mse"
//   }
// }

// Stable Diffision XL API Response example

//   {
//     "data": {
//         "artifacts": [
//             {
//                 "base64": {super base64 string is returnded here},
//                 "seed": 288735596,
//                 "finishReason": "SUCCESS"
//             }
//         ]
//     },
//     "status": 200,
//     "statusText": "",
//     "headers": {
//         "content-type": "application/json"
//     },
//     "config": {
//         "transitional": {
//             "silentJSONParsing": true,
//             "forcedJSONParsing": true,
//             "clarifyTimeoutError": false
//         },
//         "adapter": [
//             "xhr",
//             "http"
//         ],
//         "transformRequest": [
//             null
//         ],
//         "transformResponse": [
//             null
//         ],
//         "timeout": 0,
//         "xsrfCookieName": "XSRF-TOKEN",
//         "xsrfHeaderName": "X-XSRF-TOKEN",
//         "maxContentLength": -1,
//         "maxBodyLength": -1,
//         "env": {},
//         "headers": {
//             "Accept": "application/json",
//             "Content-Type": "application/json",
//             "Authorization": "Bearer {STABILITY_API_KEY}"
//         },
//         "method": "post",
//         "url": "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image",
//         "data": "{\"text_prompts\":[{\"text\":\"A lighthouse on a cliff\"}],\"cfg_scale\":7,\"clip_guidance_preset\":\"FAST_BLUE\",\"height\":512,\"width\":512,\"samples\":1,\"steps\":30}"
//     },
//     "request": {}
// }
