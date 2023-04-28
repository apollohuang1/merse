import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { JSONContent } from "@tiptap/react";
import axios, { AxiosResponse } from "axios";
import {
  Configuration,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";
import React from "react";
import {
  addScene,
  setIsGeneratingStoryboard,
  setShowGeneratedStoryboard,
} from "@/redux-store/store";

import { Scene } from "@/models/entry";
import mongoose from "mongoose";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

// Hook for creating new entries
const useCreateEntry = () => {
  // redux states
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const stopGeneratingStoryboard = () => {
    dispatch(setIsGeneratingStoryboard(false));
  };

  const startGeneratingStoryboard = () => {
    dispatch(setIsGeneratingStoryboard(true));
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
        "jyoti.rani@berkeley.edu",
      ];

      if (!manualWhitelistedEmails.includes(auth?.currentUser?.email)) {
        alert(
          "🚨 Sorry, you're not whitelisted to use the AI yet. Please ping one of us to get access."
        );
        throw new Error("User not whitelisted");
      }

      if (editor) {
        startGeneratingStoryboard();
        const editorJSON = editor.getJSON();
        const textContent = convertTiptapJSONToText(editorJSON);
        await createChatCompletion(textContent);
        // const prompt = await generatePromptFromChatGPT(textContent);
        console.log("🎉");
        console.log(textContent);
        return;
      } else {
        // handle blank editor
        stopGeneratingStoryboard();
        console.log("editor is null");
      }
    } catch (error: any) {
      stopGeneratingStoryboard();
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

      const configuration = new Configuration({
        apiKey: openaiApiKey,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: control_prompt }],
        temperature: 0.7,
        // max_tokens: 150,
        // topP: 1,
        // frequencyPenalty: 0,
        // presencePenalty: 0,
        // stop: ["\n"],
      });

      const generatedText = completion?.data?.choices[0]?.message?.content;

      // guard if generated text is null
      if (!generatedText || generatedText === "") {
        throw new Error("Generated text is null");
      }

      if (entry?.style_reference?.artist === null) {
        throw new Error("Entry style reference is null");
      }

      console.log(
        "###--------------------GENERATED TEXT--------------------###"
      );
      console.log(generatedText);

      const sceneText = stripText(generatedText);

      console.log("###--------------------SCENES--------------------###");
      console.log(sceneText);

      let splittedSceneText = sceneText
        .split("\n")
        .filter((line) => line.startsWith("Scene: "))
        .map((line) => line.substring("Scene: ".length).trim());

      // comment this out to generate only 1 image
      // createImageFromText(splittedSceneText[1]);

      // 🚨 Comment this out to generate the entire storyboard. This will burn a lot of the API quota.
      //iterate through splitedSceneText array
      for (let i = 0; i < splittedSceneText.length; i++) {
        createImageFromText(splittedSceneText[i]);
      }

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
    try {
      // stable diffusion
      const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;

      //SDXL
      // const engineId = "stable-diffusion-v1-5";
      const engineId = "stable-diffusion-xl-beta-v2-2-2";
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
      // const formattedPromptWithStyle = `${input} in ${entry?.style_reference?.artist} comic illustration artstyle`;
      // const genericPrompt = "Create a dynamic and visually striking scene that tells a compelling story. Use the principles of dynamic symmetry and the Golden Ratio to guide the composition. Focus on the main subjects, with secondary elements supporting the central narrative. Utilize the Rule of Thirds to balance the composition and reinforce focal points. Integrate the power of triangles and groups of three to add stability and interest. Use color strategically to create contrast and guide the viewer's eye. Consider the angle and point of view to create drama and enhance the story. Ensure that the silhouette of the main subjects is clear and distinct, and experiment with varying degrees of symmetry or asymmetry to create visual tension. Think ahead to the final product and the overall impact of the image on the viewer.";
      const genericPrompt =
        "Create a dynamic and visually striking scene that tells a compelling story. Use the principles of dynamic symmetry and the Golden Ratio to guide the composition. Focus on the main subjects, with secondary elements supporting the central narrative. Utilize the Rule of Thirds to balance the composition and reinforce focal points. Integrate the power of triangles and groups of three to add stability and interest. Use color strategically to create contrast and guide the viewer's eye. Consider the angle and point of view to create drama and enhance the story. Ensure that the silhouette of the main subjects is clear and distinct, and experiment with varying degrees of symmetry or asymmetry to create visual tension. Think ahead to the final product and the overall impact of the image on the viewer.";
      const improveHumanPrompt =
        "Ensure that the human figures in the scene are accurately and realistically depicted, taking into consideration proportions, anatomy, and natural poses. Pay special attention to facial expressions and body language to convey emotions and interactions between the characters effectively.";
      // const formattedPromptWithStyle = `${input} by ${entry?.style_reference?.artist}. ${genericPrompt}`;
      // const formattedPromptWithStyle = `${input} by Hayao Miyazaki. ${genericPrompt}. `;
      const formattedPromptWithStyle = `${input}. ${genericPrompt}. ${improveHumanPrompt}`;
      // const formattedPromptWithStyle = `${input} in Studio Ghibli artstyle`;
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
          style_preset: "comic-book",
          samples: 1,
          steps: 30,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const artifactsResponse: GenerationResponse =
        sdxlResponse?.data?.artifacts;
      // if (artifactsResponse) {
      //   const artifacts = artifactsResponse.artifacts; // Extract artifacts array from the response
      //   // Check if artifacts is not null or undefined
      //   if (artifacts) {
      //     const length = artifacts.length;
      //     for (let i = 0; i < length + 1; i++) {
      //       const image = artifacts[i];
      //     }
      //   }
      // }

      console.log("SDXL RESPONSE:");
      console.log(sdxlResponse.data);

      const base64String = sdxlResponse?.data?.artifacts[0].base64;
      const newImageURL = getImageURLFromBase64(base64String);
      // const imageDataURL = base64ToImageURL(base64String);

      const newScene: Scene = {
        _id: new mongoose.Types.ObjectId().toString(),
        image_base64: base64String,
        text: input,
      };

      // Entry validation failed: scenes.0.image: Path `image` is required., scenes.0._id: Path `_id` is required.
      dispatch(addScene(newScene));
      dispatch(setShowGeneratedStoryboard(true));

      stopGeneratingStoryboard();

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
      stopGeneratingStoryboard();
    }
  };

  const handleFileUpload = async (file: File) => {
    try {

      // error guards
      if (!file) throw new Error("Missing file.");
      
      if ( !process.env.AMAZON_S3_ACCESS_KEY_ID || !process.env.AMAZON_S3_SECRET_ACCESS_KEY) {
        throw new Error("Missing Amazon S3 credentials.");
      }

      if (!process.env.AMAZON_S3_BUCKET_NAME) {
        throw new Error("Missing Amazon S3 bucket name.");
      }

      const s3 = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AMAZON_S3_SECRET_ACCESS_KEY,
        },
      });

      const params: PutObjectCommandInput = {
        Bucket: process.env.AMAZON_S3_BUCKET_NAME,
        Key: `images/${file.name}`,
        Body: file,
        ContentType: file.type,
        ACL: "public-read",
      };

      const command = new PutObjectCommand(params);
      const response = await s3.send(command);
      // console.log(response.Location);
    } catch (error: any) {
      console.error("Failed to upload file, message: ", error.message);
    }
  };

  const getImageURLFromBase64 = (base64: string) => {
    // const buff = Buffer.from(base64, "base64");
    // const dataURL = `data:image/png;base64,${buff.toString("base64")}`;
    const dataURL = `data:image/png;base64,${base64}`;
    return dataURL;
  };

  const imageURLToBase64 = (dataURL: string): string => {
    const buffer = Buffer.from(dataURL.split(",")[1], "base64");
    const base64 = buffer.toString("base64");
    return base64;
  };

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
    generateStoryboard,
    saveEntry,
    handleFileUpload,
  };
};

export default useCreateEntry;
