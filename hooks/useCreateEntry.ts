import React from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { Editor, JSONContent } from "@tiptap/react";
import axios from "axios";


import {
  Configuration,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";

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

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/store";

// Hook for creating new entries
const useCreateEntry = () => {
  // redux states
  
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);
  const auth = useAppSelector((state) => state.auth);
  const stylePreset = useAppSelector((state) => state.entry.style_preset);

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
      const response = await axios({
        method: "POST",
        url: "/api/entries",
        data: entry,
        headers: {
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      console.log("here: ", response);

      if (response.status === 200 && response.data.reason === "update") {
        router.push(`/entry/${response.data.updatedEntry._id}`);
      } else {
        router.push(`/`);
      }

      setTimeout(() => {
        dispatch(setShowNotifications(true));
        dispatch(setNotificationContent({
          title: "Saved!",
          message: "Your entry has been saved successfully.",
        }));
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

      if (!editor || editor?.isEmpty) {
        throw new Error("Editor is null");
      }

      startGeneratingStoryboard();
      const editorJSON = editor.getJSON();
      const textContent: string = convertTiptapJSONToText(editorJSON);

      // scenes text from gpt3.5 as generating prompts
      const scenesControlPrompt =
        'For the "TEXT_STORY" below, generate content for a graphic novel in the following "FORMAT":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed, but DO NOT generate new storylines that are not in TEXT_STORY) \nTEXT_STORY: ';
        //'For the "TEXT_STORY" below, generate content for a graphic novel in the following "FORMAT":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed) \nDialogue: should be labeled (without parantheses) by which character is speaking. \nTEXT_STORY: ';
        const generatedText = await createGenericChatCompletion(
        textContent,
        scenesControlPrompt
      );

      // ❌ SENSITIVE, COMMENT OUT BEFORE COMMITTING when whitelisted users are not our team. It's okay for now.
      console.log(
        "###--------------------GENERATED TEXT--------------------###"
      );
      console.log(generatedText);

      const sceneText: string = getStripTextsArray(generatedText);

      if (!sceneText) {
        throw new Error("No scene text generated");
      }

      // ❌ SENSITIVE, COMMENT OUT BEFORE COMMITTING when whitelisted users are not our team. It's okay for now :))
      console.log("###--------------------SCENES--------------------###");
      console.log(sceneText);

      // array of scenes, each have a scene description but not for displaying. only for generating images.
      let sceneTextsArray: string[] = sceneText
        .split("\n")
        .filter((line) => line.startsWith("Scene: "))
        .map((line) => line.substring("Scene: ".length).trim());

      // ❌ SENSITIVE, COMMENT OUT BEFORE COMMITTING when whitelisted users are not our team. It's okay for now :))
      console.log(
        "###--------------------SPLITTED SCENES--------------------###"
      );
      console.log(sceneTextsArray);

      // comment this out to generate only 1 image
      const base64String = await createImageFromText(sceneTextsArray[0]);

      // diary text
      const splittedSceneText: string[] = sceneText
        ?.split("\n")
        .filter((line) => line.startsWith("Scene: "))
        .map((line) => line.substring("Scene: ".length).trim());
      const sceneDescriptions: string = splittedSceneText.join("\n");

      // ❌ SENSITIVE, COMMENT OUT BEFORE COMMITTING when whitelisted users are not our team. It's okay for now :))
      console.log(
        "###--------------------SCENE DESCRIPTIONS--------------------###"
      );
      console.log(sceneDescriptions);

      const diaryTextControlPrompt =
        'For EACH of the "Scene" below, generate a very short narrative description in a diary-format (2-3 sentences). Number each scene and put the description (for example, Scene 1: Today was a good day!). Do not put create lots of additional information than what is already stated:\nSCENE_TEXT: ';
      const generatedDiaryText: string = await createGenericChatCompletion(
        sceneDescriptions,
        diaryTextControlPrompt
      );

      // ❌ SENSITIVE, COMMENT OUT BEFORE COMMITTING when whitelisted users are not our team. It's okay for now :))
      console.log(
        "###--------------------GENERATED DIARY TEXT--------------------###"
      );
      console.log(generatedDiaryText);

      // push ONLY 1 scene to storyboard UI
      const newScene: Scene = {
        _id: new mongoose.Types.ObjectId().toString(),
        image_base64: base64String,
        prompt: sceneTextsArray[0],
        displayed_text:
          "Annyeong Emily❤️ Diary text should be here, check out the newScene: Scene interface in useCreateEntry hook :))",
      };
      dispatch(addScene(newScene));
      dispatch(setShowGeneratedStoryboard(true));

      // 🚨 Comment this out to generate the entire storyboard. This will burn a lot of the API quota.
      // iterate through splitedSceneText array
      // for (let i = 0; i < sceneTextsArray.length; i++) {
      //   const base64String = await createImageFromText(sceneTextsArray[i]);
      //   const newScene: Scene = {
      //     _id: new mongoose.Types.ObjectId().toString(),
      //     image_base64: base64String,
      //     prompt: sceneTextsArray[1],
      //     displayed_text: "should be diary text here",
      //   };
      //   dispatch(addScene(newScene));
      //   dispatch(setShowGeneratedStoryboard(true));
      // }
    } catch (error: any) {
      console.log(`Failed to generate storyboard, message: ${error?.message}`);
    } finally {
      stopGeneratingStoryboard();
    }
  };

  /**
   * Universal function for chatgpt response that returns a string promise (resolve and reject)
   * @param input text to be sent :)
   * @param control_prompt command to tell gpt3.5 what to do
   * @returns promise of string
   */
  const createGenericChatCompletion = async (
    input: string,
    control_prompt: string
  ): Promise<string> => {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    //const control_prompt = "For the \"TEXT\" below, generate content for a graphic novel in the following \"FORMAT\":\nFORMAT:\nPanel 1:\n (Scene: make sure the description is detailed of roughly 100 words, formatted as a text-to-image prompt input.) \nDialogue: should be labeled by which character is speaking WITHOUT parentheses. \nTEXT: " + input;
    // const control_prompt = 'For the "TEXT_STORY" below, generate content for a graphic novel in the following "FORMAT":\nFORMAT:\nPanel #:\n (Scene: put the scene description *all* in parantheses and make it very detailed) \nDialogue: should be labeled (without parantheses) by which character is speaking. \nTEXT_STORY: ' + input;

    const configuration = new Configuration({
      apiKey: openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: control_prompt + input }],
      temperature: 0.7,
    });

    const generatedText = completion?.data?.choices[0]?.message?.content;

    // guard if generated text is null
    if (!generatedText || generatedText === "") {
      throw new Error("Generated text is null");
    }

    if (entry?.style_reference?.artist === null) {
      throw new Error("Entry style reference is null");
    }

    return generatedText;
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
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: "FAST_BLUE",
        height: 512,
        width: 512,
        style_preset: stylePreset,
        samples: 1,
        steps: 30,
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
  const getOpenAIInsertedText = async (input: string) => {
    try {

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const openai = new OpenAIApi(configuration);
  
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input,
        suffix: "",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    } catch (error: any) {
      console.log("Failed to get insert text: ", error.message);
    }
  };

  //new 4/30 -----
  const handleFileUpload = async (file: File) => {
    try {
      // error guards
      if (!file) throw new Error("Missing file.");

      if (
        !process.env.AMAZON_S3_ACCESS_KEY_ID ||
        !process.env.AMAZON_S3_SECRET_ACCESS_KEY
      ) {
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

  const getStripTextsArray = (input: string): string => {
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
    convertTiptapJSONToText,
    getOpenAIInsertedText,
    saveEntry,
    handleFileUpload,
  };
};

export default useCreateEntry;