import { NextRequest, NextResponse } from "next/server";

import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";

import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
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

    // create new user in db
    const db = await dbConnect();
    const body = await request.json();

    const existingUser = await MDBUser.findOne({ email: body.email })

    if (existingUser) {
      // return NextResponse.json({ error: "User already exists" }, { status: 400 });
      return NextResponse.json(existingUser, { status: 200 });
    }

    const newUser = new MDBUser({
      _id: new mongoose.Types.ObjectId(),
      name: body.name,
      email: body.email,
      profile_image_url: body.picture,
      followers: [],
      followings: [],
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// update
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

    const updatedUser = await MDBUser.findOneAndUpdate(filter, body);
    
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}