import axios from "axios";
import { NextRequest } from "next/server";





export async function POST(request: NextRequest) {

  const body = await request.body;

  // get api key from bear token
  const token = request.headers.get("authorization");

  // if key is not process.env.MERSE_API_KEY
  if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }


  return new Response(body, { status: 200 });
}