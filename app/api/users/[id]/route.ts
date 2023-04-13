import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    
    // get the final route from pathname
    const uid = pathname.split("/").pop(); // userId

    return NextResponse.json({ data: "hello test yayyyy", uid: uid}, { status: 200 });
  } catch (error: any) {
    console.log("Failed to generate image:", error?.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}