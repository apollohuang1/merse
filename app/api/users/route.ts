

import { NextRequest, NextResponse } from "next/server";

import dbConnect from "../../../server/utils/dbConnect";
import Pet from "../../../server/models/Pet";
import User from "../../../server/models/User";

const mongoose = require("mongoose");


export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const data = await User.find({});
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}


export async function POST(request: Request) {

  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    name: "Emily Park",
  });

  try {
    const savedUser = await newUser.save();
    return NextResponse.json({ success: true, data: savedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }

  // await newUser.save(function (err: any, user: any) {
  //   if (err) return console.error(err);
  //   console.log(user.name + " saved to users collection.");
  // });

  // return NextResponse.json({ success: true, data: newUser });
}