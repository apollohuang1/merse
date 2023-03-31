

import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(request) {

  const key = process.env.NEXT_PUBLIC_MONGODB_URI
  mongoose.connect(key) 

  const res = {
    key: key,
    connect: {
      readyState: mongoose.connection.readyState,
    }
  }

  return NextResponse.json({hello: res});
}