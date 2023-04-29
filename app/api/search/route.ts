import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {

    await dbConnect();
    // const body = await req.json();

    const searchParams = new URLSearchParams(req.url.split("?")[1]);
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