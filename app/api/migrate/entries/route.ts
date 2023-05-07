
import MDBEntry from "@/server/models/MDBEntry";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

   // get api key from bear token
   const token = request.headers.get("authorization");

   // if key is not process.env.MERSE_API_KEY
   if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
     return new Response("Unauthorized", { status: 401 });
   }
   
  await dbConnect();
  const allEntries = await MDBEntry.find({});
  return NextResponse.json(allEntries, { status: 200 });
}