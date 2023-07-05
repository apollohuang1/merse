import MDBSeries from "@/server/models/MDBSeries";
import dbConnect from "@/server/utils/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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

    // if (!body._id) {
    //   return NextResponse.json({ error: "No _id provided" }, { status: 400 });
    // }

    const newSeries = new MDBSeries({
      ...body,
      // _id: new mongoose.Types.ObjectId().toHexString(),
      created_at: new Date(),
    });

    const savedSeries = await newSeries.save();

    return NextResponse.json(savedSeries, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}