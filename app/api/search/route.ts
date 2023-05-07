import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {

     // get api key from bear token
     const token = request.headers.get("authorization");

     // if key is not process.env.MERSE_API_KEY
     if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
       return new Response("Unauthorized", { status: 401 });
     }

    await dbConnect();
    // const body = await req.json();

    const searchParams = new URLSearchParams(request.url.split("?")[1]);
    const searchQuery = searchParams.get("query") as string;

    const regex = new RegExp(searchQuery, "i");

    const reponse = await MDBUser.find({
      name: { $regex: regex },
    })
    .limit(7);

    return NextResponse.json(reponse, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}