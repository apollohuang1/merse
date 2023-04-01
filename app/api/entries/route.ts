import dbConnect from "@/server/utils/dbConnect";
import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request) {

  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const movies = await db
        .collection("movies")
        .find({})
        .sort({ metacritic: -1 })
        .limit(10)
        .toArray();

    return NextResponse.json({
      data: movies
    });
} catch (e: any) {
    console.error(e);
    return NextResponse.json({
      message: "Error" + e.message
    });
}};