import MDBNotification from "@/server/models/MDBNotification";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


// export async function POST(request: NextRequest) {
//   try {

//      // get api key from bear token
//      const token = request.headers.get("authorization");

//      // if key is not process.env.MERSE_API_KEY
//      if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
//        return new Response("Unauthorized", { status: 401 });
//      }

//      const body = await request.json();

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
