

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