import { NextRequest, NextResponse } from "next/server";

import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";

import mongoose from "mongoose";

export async function GET(request: Request) {
  try {

    // get api key from bear token
   const token = request.headers.get("authorization");

   // if key is not process.env.MERSE_API_KEY
   if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
     return new Response("Unauthorized", { status: 401 });
   }

    const db = await dbConnect();

    const searchParams = new URLSearchParams(request.url.split("?")[1]);
    const searchingEmail = searchParams.get("email");

    const data = await MDBUser.findOne({
      email: searchingEmail,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    // get api key from bear token
   const token = request.headers.get("authorization");

   // if key is not process.env.MERSE_API_KEY
   if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
     return new Response("Unauthorized", { status: 401 });
   }

    // create new user in db
    const db = await dbConnect();
    const body = await request.json();

    const existingUser = await MDBUser.findOne({ email: body.email })

    if (existingUser) {

      // if existing user has no joined_at, update to current date
      if (!existingUser.joined_at) {
        existingUser.joined_at = new Date();
        await existingUser.save();
      }

      return NextResponse.json(existingUser, { status: 200 });
    }

    const newUser = new MDBUser({
      _id: new mongoose.Types.ObjectId(),
      name: body.name,
      email: body.email,
      username: body.username,
      banner_image_url: body.banner_image_url,
      profile_image_url: body.profile_image_url,
      followers: [],
      followings: [],
      joined_at: new Date(),
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// update profile
export async function PUT(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const filter = { _id: body._id }

    // check username
    const isUserExisted = await MDBUser.findOne({ username: body.username });

    if (isUserExisted && isUserExisted._id.toString() !== body._id) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const updatedUser = await MDBUser.findOneAndUpdate(filter, body, { new: true });
    
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}