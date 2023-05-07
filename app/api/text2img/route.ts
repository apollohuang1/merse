import useCreateEntry from "@/hooks/useCreateEntry";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;

    if (!stableDiffusionApiKey) {
      throw new Error("Missing Stable Diffusion API key");
    }

    const body = await request.json();

    if (!body.prompt || body.prompt === "") {
      throw new Error("Missing prompt");
    }

    const requestData = {
      key: stableDiffusionApiKey,
      prompt: body.prompt, //input
      negative_prompt:
        "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs))",
      width: "512",
      height: "512",
      samples: "1",
      seed: null,
    };

    const response = await axios({
      method: "POST",
      url: "https://stablediffusionapi.com/api/v3/text2img",
      data: requestData,
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.log("Failed to generate image:", error?.message);
    // return next response with message
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
