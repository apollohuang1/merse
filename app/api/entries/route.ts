import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MDBEntry from "@/server/models/MDBEntry";


export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // const get params from fullURL
    const url = new URL(request.url);
    const entryId = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (userId) {
      // fetch all
      const allEntriesFromUser = await MDBEntry.find({
        author: userId,
      });
      return NextResponse.json(allEntriesFromUser, { status: 200 });
    }

    if (entryId) {
      const oneEntry = await MDBEntry.findById(entryId).populate("author");

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

     // get api key from bear token
     const token = request.headers.get("authorization");

     // if key is not process.env.MERSE_API_KEY
     if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
       return new Response("Unauthorized", { status: 401 });
     }

    // guards
    if (!body) {
      return NextResponse.json({ error: "No body provided" }, { status: 400 });
    }

    if (!body._id) {
      return NextResponse.json({ error: "No _id provided" }, { status: 400 });
    }

    const newEntry = new MDBEntry({
      _id: body._id,
      author: body.author,
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
    console.log(error.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}