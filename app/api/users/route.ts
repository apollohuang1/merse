

import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../server/utils/dbConnect";
import Pet from "../../../server/models/Pet";
import User from "../../../server/models/User";


export async function GET(request: Request) {
  // await dbConnect();

  try {
    // const pets = await Pet.find({}) /* find all the data in our database */
    return NextResponse.json({status: 200, data: {
      hello: "world",
    }});
  } catch (error) {
    return NextResponse.json({status: 400, data: error});
  }
}


export async function POST(request: Request) {

  const newUser = new User({
    _id: "12",
    name: "John",
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser.name + " saved to users collection.");
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