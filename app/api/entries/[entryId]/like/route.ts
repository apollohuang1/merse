import MDBEntry from "@/server/models/MDBEntry";
import dbConnect from "@/server/utils/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {

    await dbConnect();
    const body = await request.json();

    // guard id
    if (!body.entryId) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    // push likes that is user reference
    const reponse = await MDBEntry.findByIdAndUpdate(
      body.entryId,
      {
        $push: {
          likes: new mongoose.Types.ObjectId(body.userId),
        },
      }, { new: true }
    )
    
    return NextResponse.json(reponse, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(error?.message, { status: 500 });
  }
}