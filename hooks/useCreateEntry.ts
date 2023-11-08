import React from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { Editor, JSONContent } from "@tiptap/react";
import axios from "axios";

import OpenAI from "openai";

import {
  addScene,
  setIsGeneratingStoryboard,
  setNotificationContent,
  setShowGeneratedStoryboard,
  setShowNotifications,
} from "@/redux-store/store";

import { Scene } from "@/models/entry";
import mongoose from "mongoose";

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/store";
import { manualWhitelistedEmails } from "@/util/constants/create-constants";
import { json } from "stream/consumers";

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

  const router = useRouter();

  const saveEntry = async () => {
    try {
      const authorId = auth?.currentUser?._id;

      if (!authorId) throw new Error("Unauthorized User.");

      // FOR EMILY: COMMENT THIS OUT TO CONTINUE YOUR CODE!! ❤️❤️❤️❤️❤️
      // I commented it out bc I will have to deploy on prod

      // Assuming updated_image_base64_variants holds your base64 images
      // for (let i = 0; i < updated_image_base64_variants.length; i++) {
      //   const base64Image = updated_image_base64_variants[i];

      //   // Convert base64 image to a Blob
      //   const blob = await fetch(`data:image/png;base64,${base64Image}`).then((res) => res.blob());

      //   // Get the upload URL from the server
      //   const { url } = await fetch("/s3Url").then((res) => res.json());

      //   // Upload the Blob to S3
      //   await fetch(url, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": blob.type
      //     },
      //     body: blob
      //   });

      //   // Replace the base64 image with the S3 URL in the entry
      //   const s3Url = url.split('?')[0];
      //   updated_image_base64_variants[i] = s3Url;
      // }

      // Save the entry with the S3 URLs instead of the base64 images
      const response = await axios({
        method: "POST",
        url: "/api/entries",
        data: { ...entry, author: authorId },
        // switch the code line here to use your s3 code as well!✨
        // data: { ...entry, images: updated_image_base64_variants, author: authorId },
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.reason === "update") {
        router.push(`/entry/${response.data.updatedEntry._id}`);
      } else {
        router.push(`/`);
      }

      setTimeout(() => {
        dispatch(setShowNotifications(true));
        dispatch(
          setNotificationContent({
            title: "Saved!",
            message: "Your entry has been saved successfully.",
          })
        );
      }, 1000);
    } catch (error: any) {
      console.log(`Failed to save entry, message: ${error?.message}`);
    }
  };

  // Only use try catch block here. sub-functions should handle/throw their own errors to this like a dumb
  const generateStoryboard = async (editor: Editor | null) => {

    try {

      // guard log in to prevent anonymous users from burning our API credits
      if (auth?.currentUser === null) {
        alert(
          "🚨 Please log in to generate a storyboard.\n\nFor now, you can browse and play around without logging in, but you won't be able to save your work or use AI to generate images :))"
        );
        throw new Error("User not logged in");
      }

      if (!manualWhitelistedEmails.includes(auth?.currentUser?.email)) {
        // alert to let people know we're still developing
        alert(
          "Sorry, we're still developing this feature. We will let you know when it's ready!"
        );
        throw new Error("User not whitelisted");
      }

      if (!editor || editor?.isEmpty) {
        throw new Error("Editor is null");
      }

      startGeneratingStoryboard();
      const editorJSON = editor.getJSON();
      const textContent: string = convertTiptapJSONToText(editorJSON);

      const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });

      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: "Create a JSON array with 7 objects, each containing a single key-value pair. The key should be 'image_prompt' followed by a descriptive string for a comic panel. There should be a root element called prompts" },
          { role: "user", content: textContent },
        ],
        response_format: {
          type: "json_object",
        },
      });

      const promptsArrayString = response.choices[0].message.content
      const panels = JSON.parse(promptsArrayString as string)

      console.log("###--------------------GENERATED PANELS--------------------###");
      console.log(panels.prompts.length);

      // loop in panels.prompts length
      // for (let i = 0; i < panels.prompts.length; i++) {
      for (let i = 0; i < 2; i++) {
        const prompt = panels.prompts[i].image_prompt
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt + "in comic style",
          n: 1,
          size: "1024x1024",
        });

        const image_url = response.data[0].url

        console.log("###--------------------GENERATED IMAGE URL--------------------###");
        console.log(image_url);

        const newScene: Scene = {
          _id: new mongoose.Types.ObjectId().toString(),
          image_url: image_url as string,
          prompt: prompt,
        };

        dispatch(addScene(newScene));
        dispatch(setShowGeneratedStoryboard(true));

      }

    } catch (error: any) {
      console.log(`Failed to generate storyboard, message: ${error?.message}`);
      console.log(error);
    } finally {
      stopGeneratingStoryboard();
    }
  };

  const addSceneFromCustomPrompt = async (prompt: string) => {
    // const imageBase64String = await createImageFromText(prompt);
    // const newScene: Scene = {
    //   _id: new mongoose.Types.ObjectId().toString(),
    //   image_base64: imageBase64String,
    //   prompt: prompt,
    //   displayed_text: prompt,
    // };
    // dispatch(addScene(newScene));
  };


  /**
   *
   * @param input prompt text to be sent to stable diffusion
   */
  const createImageFromText = async (input: string) => {
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
    const genericPrompt =
      "Create a dynamic and visually striking scene that tells a compelling story. Use the principles of dynamic symmetry and the Golden Ratio to guide the composition. Focus on the main subjects, with secondary elements supporting the central narrative. Utilize the Rule of Thirds to balance the composition and reinforce focal points. Integrate the power of triangles and groups of three to add stability and interest. Use color strategically to create contrast and guide the viewer's eye. Consider the angle and point of view to create drama and enhance the story. Ensure that the silhouette of the main subjects is clear and distinct, and experiment with varying degrees of symmetry or asymmetry to create visual tension. Think ahead to the final product and the overall impact of the image on the viewer.";
    const improveHumanPrompt =
      "Ensure that the human figures in the scene are accurately and realistically depicted, taking into consideration proportions, anatomy, and natural poses. Pay special attention to facial expressions and body language to convey emotions and interactions between the characters effectively.";
    // const formattedPromptWithStyle = `${input} by ${entry?.style_reference?.artist}. ${genericPrompt}`;
    // const formattedPromptWithStyle = `${input} by Hayao Miyazaki. ${genericPrompt}. `;
    // const formattedPromptWithStyle = `${input} in Studio Ghibli artstyle`;
    const formattedPromptWithStyle = `${input}. ${genericPrompt}. ${improveHumanPrompt}`;

    // Response of NEW Stable Diffusion XL
    const sdxlResponse = await axios({
      method: "POST",
      url: `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      data: {
        text_prompts: [
          {
            // text: "A lighthouse on a cliff",
            text: formattedPromptWithStyle,
            weight: 0.5,
          },
        ],
        //cfg_scale: 7,
        //clip_guidance_preset: "FAST_BLUE",
        height: 512,
        width: 512,
        style_preset: entry?.style_reference?.preset,
        samples: 1,
        steps: 50,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    interface GenerationResponse {
      artifacts: Array<{
        base64: string;
        seed: number;
        finishReason: string;
      }>;
    }

    const sdxlReponseData: GenerationResponse = sdxlResponse?.data;

    // const base64String = sdxlResponse?.data?.artifacts[0].base64;
    const base64String = sdxlReponseData.artifacts[0].base64;

    return base64String;
  };

  /**
   * ❌ DO NOT USE THIS FUNCTION. OPENAI USAGE WILL SPIKE SUPER HIGH. WE WILL ADD THIS LATER TO MAKE EDITOR SIMILAR TO GITHUB CO-PILOT WHEN REVENUE BREAKS EVEN.
   * @param input
   */
  // const getOpenAIInsertedText = async (input: string) => {
  //   try {
  //     const configuration = new Configuration({
  //       apiKey: process.env.OPENAI_API_KEY,
  //     });

  //     const openai = new OpenAIApi(configuration);

  //     const response = await openai.createCompletion({
  //       model: "text-davinci-003",
  //       prompt: input,
  //       suffix: "",
  //       temperature: 0.7,
  //       max_tokens: 256,
  //       top_p: 1,
  //       frequency_penalty: 0,
  //       presence_penalty: 0,
  //     });
  //   } catch (error: any) {
  //     console.log("Failed to get insert text: ", error.message);
  //   }
  // };

  //new 4/30 -----
  const handleFileUpload = async (file: File) => {
    const accessKeyId = process.env.AMAZON_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AMAZON_S3_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("Missing AWS credentials");
    }

    const client = new S3Client({
      region: "us-west-2",
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AMAZON_S3_BUCKET_NAME,
      Key: file.name,
      Body: file,
    });

    try {
      const response = await client.send(command);
      // get url from uploaded image
      // @ts-ignore
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      console.log(response);
      console.log("url: ", url);
    } catch (err) {
      console.error(err);
    }

    // console.log("file from handler: ", file);

    // const uploadResponse = await axios({
    //   method: "POST",
    //   url: "/api/upload",
    //   data: file,
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.MERSE_API_KEY}`,
    //   },
    // })

    // console.log("Upload response: ", uploadResponse);
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

  const getStripText = (input: string): string => {
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
    // return matches;
    return matches.join("\n");
  };

  return {
    generateStoryboard,
    createImageFromText,
    addSceneFromCustomPrompt,
    convertTiptapJSONToText,
    // getOpenAIInsertedText,
    saveEntry,
    handleFileUpload,
  };
};

export default useCreateEntry;
