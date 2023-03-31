

import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../server/utils/dbConnect";
import Pet from "../../../server/models/Pet";


export async function GET(request: Request) {

  const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI

  await dbConnect();

  var body;
  var status;

  try {
    const pets = await Pet.find({}) /* find all the data in our database */
    body = { success: true, data: pets }
    status = 200

  } catch (error) {
    body = { success: false }
    status = 400
  }

  return NextResponse.json(body, { status: status });
}


export async function POST(request: Request) {
  
    const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
    var newDog = new Pet(request.body);

    newDog.save(function (err: any, dog: any) {
      if (err) return console.error(err);
      console.log(dog.name + " saved to pets collection.");
    });

    return NextResponse.json({ success: true, data: newDog });
}