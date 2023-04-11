import { NextRequest, NextResponse } from "next/server";

import dbConnect from "../../../server/utils/dbConnect";
import Pet from "../../../server/models/MDBPet";
import MDBUser from "../../../server/models/MDBUser";

const mongoose = require("mongoose");

export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const data = await MDBUser.find({});
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    const db = await dbConnect();

    const body = await request.json();

    const newUser = new MDBUser({
      _id: new mongoose.Types.ObjectId(),
      name: body.name,
      email: body.email,
      profile_image_url: body.profile_image_url,
      // _id: new mongoose.Types.ObjectId(),
      // name: "Emily Park",
      // email: "emily.park@berkeley.edu",
      // profile_image_url: "https://media.discordapp.net/attachments/1090027780525273153/1094610033930678272/telegram-peer-photo-size-1-5138860470982257726-1-0-0.jpg?width=1280&height=1280",
    });

    const savedUser = await newUser.save();
    return NextResponse.json({ data: savedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
