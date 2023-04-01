import User from "@/server/models/User";
import dbConnect from "@/server/utils/dbConnect";
import { NextResponse } from "next/server";
const mongoose = require('mongoose');


export async function GET(request: Request) {
  try {
    const db = await dbConnect();
    const data = await User.find({});
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}