import MDBNotification from "@/server/models/MDBNotification";
import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { getLastIdFromUrl } from "@/util/helper";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {

    await dbConnect();

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // get the final route from pathname
    const userId = getLastIdFromUrl(request.url);

    if (!userId || userId === "undefined") {
      throw new Error("No userId provided");
    }

    const notifications = await MDBNotification.find({
      // recipient: in mongoose ObjectId type
      recipient: userId,
    })
    .populate({
      path: "sender",
      select: "profile_image_url name username _id",
      model: MDBUser,
    })
    .sort({ createdAt: -1 });

    return NextResponse.json(notifications, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}