import MDBEntry from "@/server/models/MDBEntry";
import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { getLastIdFromUrl } from "@/util/helper";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // guard api key
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const entryId = getLastIdFromUrl(request.url);

    const entryData = await MDBEntry.findById(new mongoose.Types.ObjectId(entryId))
      .lean()
      .populate({
        path: "author",
        select: "profile_image_url name username _id",
        model: MDBUser,
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "profile_image_url username _id",
          model: MDBUser
        },
      })
      .exec();

    return NextResponse.json(entryData, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
