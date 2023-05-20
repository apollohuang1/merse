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
    const userId = url.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    // fetch all entries from user
    const allEntriesFromUser = await MDBEntry.find({
      author: userId,
    })
      // .skip(0)
      // .limit(10)
      .populate({
        path: "author",
        select: "profile_image_url name username _id",
      })
      .sort({ created_at: "descending" });

    return NextResponse.json(allEntriesFromUser, { status: 200 });

  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json(error.message, { status: 500 });
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

    // check if exist
    const updatedEntry = await MDBEntry.findByIdAndUpdate(
      body._id,
      {
        // set the entire entry, not specific fields
        $set: {
          ...body,
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    if (updatedEntry) {
      // redirect
      return NextResponse.json(
        { updatedEntry: updatedEntry, reason: "update" },
        { status: 200 }
      );
    }

    const newEntry = new MDBEntry({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
      cover: {
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCdoBj4sMKAneZ35yzHHceTTZWXaQly7e46eVsJ1oGD29RKEz71w6KG7jyvXw47uDMnQ&usqp=CAU",
      },
    });

    // const newEntry = new MDBEntry({
    //   _id: body._id,
    //   author: body.author,
    //   title: body.title,
    //   style_reference: body.style_reference,
    //   content: body.content,
    //   chat_messages: body.chat_messages,
    //   characters: body.characters,
    //   cover: {
    //     image_url:
    //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCdoBj4sMKAneZ35yzHHceTTZWXaQly7e46eVsJ1oGD29RKEz71w6KG7jyvXw47uDMnQ&usqp=CAU",
    //   },
    //   scenes: body.scenes,
    //   canvas: body.canvas,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    //   likes: body.likes,
    //   comments: body.comments,
    //   is_private: body.is_private,
    // });

    const savedEntry = await newEntry.save();

    return NextResponse.json(savedEntry, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// put functio to add likes and comments
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // guards
    if (!body) {
      return NextResponse.json({ error: "No body provided" }, { status: 400 });
    }

    if (!body._id) {
      return NextResponse.json({ error: "No _id provided" }, { status: 400 });
    }

    const updatedEntry = await MDBEntry.findByIdAndUpdate(
      body._id,
      {
        $set: {
          likes: body.likes,
          comments: body.comments,
        },
      },
      { new: true }
    );

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const _id = url.searchParams.get("id");

    if (!_id) {
      return NextResponse.json({ error: "No _id provided" }, { status: 400 });
    }

    const response = await MDBEntry.findOneAndDelete({ _id: _id });

    return NextResponse.json("hello", { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
