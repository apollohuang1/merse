import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Entry from "@/server/models/entry";
import mongoose from "mongoose";


export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const data = await Entry.find({});
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {

  try {
    const newEntry = new Entry({
      _id: new mongoose.Types.ObjectId(),
      title: "Content Title Test #1 ",
      styleRefereence: {
        artist: "Artist Name Test #1",
      },
      content: "Content Test #1",
    });

    const savedEntry = await newEntry.save();
    
    return NextResponse.json({ success: true, data: savedEntry });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}