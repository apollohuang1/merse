import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MDBEntry from "@/server/models/MDBEntry";


export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();

    // const get params from fullURL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (userId) {
      // fetch all
      const allEntriesFromUser = await MDBEntry.find({
        user_id: userId,
      });
      return NextResponse.json(allEntriesFromUser, { status: 200 });
    }

    if (id) {
      const oneEntry = await MDBEntry.findOne({
        _id: id,
      })
      return NextResponse.json(oneEntry, { status: 200 });
    } 

  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {

  try {

    await dbConnect();
    const body = await request.json();

    const newEntry = new MDBEntry({
      _id: new mongoose.Types.ObjectId(),
      user_id: body.user_id,
      title: body.title,
      style_reference: body.style_reference,
      content: body.content,
      characters: body.characters,
      cover: {
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCdoBj4sMKAneZ35yzHHceTTZWXaQly7e46eVsJ1oGD29RKEz71w6KG7jyvXw47uDMnQ&usqp=CAU",
      },
      scenes: body.scenes,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedEntry = await newEntry.save();
    
    return NextResponse.json(savedEntry, { status: 200 });
  } catch (error: any) {
    console.log(error);
    console.log(error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}