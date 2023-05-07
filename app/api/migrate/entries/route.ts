
import MDBEntry from "@/server/models/MDBEntry";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  await dbConnect();
  const allEntries = await MDBEntry.find({});
  return NextResponse.json(allEntries, { status: 200 });
}