import useEntryCreate from "@/hooks/useCreateEntry";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;

    if (!stableDiffusionApiKey) {
      throw new Error("Missing Stable Diffusion API key");
    }

    const body = await req.json();
    
    if (!body.prompt || body.prompt === "") {
      throw new Error("Missing prompt");
    }

    const requestData = {
      key: stableDiffusionApiKey,
      prompt: body.prompt, //input
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
    })

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error:any) {
    console.log("Failed to generate image:", error?.message);
    // return next response with message
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }


}