import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    await dbConnect();

    const { pathname } = new URL(request.url);

    // get the final route from pathname
    const email = pathname.split("/").pop(); // userId

    const userData = await MDBUser.findOne({ email: email });

    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    console.log("Failed to generate image:", error?.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}