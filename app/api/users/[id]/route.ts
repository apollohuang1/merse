import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    await dbConnect();

    const { pathname } = new URL(request.url);

    // get the final route from pathname
    const usernameOrId = pathname.split("/").pop(); // userId

    const query = {
      $or: [
        { username: usernameOrId },
        { _id: usernameOrId }
      ],
    };

    const userData = await MDBUser.findOne(query);

    // find user by username or id
    // const userData = await MDBUser.find({
    //   $or: [
    //     { username: usernameOrId },
    //     { _id: usernameOrId }
    //   ]
    // })

    // const userData = await MDBUser.findById(userId);

    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    console.log("Failed to generate image:", error?.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}