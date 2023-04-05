import useEntryCreate from "@/hooks/useCreateEntry";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {
    //console.log("-:1");
    const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
    console.log("Key: " + stableDiffusionApiKey);

    const requestData = {
      key: stableDiffusionApiKey,
      prompt: "girl and boy sitting in san francisco, illustration", //input
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

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error:any) {
    console.log("Failed to generate image:", error?.message);
    return NextResponse.json({ data: error?.message }, { status: 500 });
  }


}