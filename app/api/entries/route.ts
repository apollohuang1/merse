import Entry from "@/server/models/Entry";
import dbConnect from "@/server/utils/dbConnect";
import axios from "axios";
import { NextResponse } from "next/server";

import mongoose from "mongoose";

export async function GET(req: Request) {
  // await dbConnect();

  return NextResponse.json({
    status: 200,
    data: {
      hello: "world",
    },
  });
}
