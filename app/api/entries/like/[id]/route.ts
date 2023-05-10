import MDBEntry from "@/server/models/MDBEntry";
import dbConnect from "@/server/utils/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, { params }: any) {
  try {

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // guard id
    if (!params?.id) {
      return NextResponse.json({ error: "No entry id provided, please add [id] in request url." }, { status: 400 });
    }

    if (!body) {
      return NextResponse.json({ error: "No body provided" }, { status: 400 });
    }

    if (!body.action) {
      return NextResponse.json({ error: "No action provided in body" }, { status: 400 });
    }

    const action: "like" | "unlike" = body.action;

    // push likes that is user reference but if user already liked, then unlike


    const addToSetConfig = {
      $addToSet: {
        likes: new mongoose.Types.ObjectId(body.userId),
      },
    }
    
    const pullConfig = {
      $pull: {
        likes: new mongoose.Types.ObjectId(body.userId),
      },
    }

    const updatedDocument = await MDBEntry.findByIdAndUpdate(
      params.id,
      action === "like" ? addToSetConfig : pullConfig, 
      { new: true }
    )

    if (!updatedDocument) {
      return NextResponse.json({ error: "No entry found with id: " + params.id }, { status: 404 });
    }

    return NextResponse.json(updatedDocument.likes, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(error?.message, { status: 500 });
  }
}