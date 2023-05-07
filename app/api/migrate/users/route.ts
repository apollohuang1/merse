import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  await dbConnect();
  const allUsers = await MDBUser.find({});
  return NextResponse.json(allUsers, { status: 200 });
}