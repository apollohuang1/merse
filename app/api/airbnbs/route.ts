
import Airbnb from "@/server/models/Airbnb";
import dbConnect from "@/server/utils/dbConnect";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  await dbConnect();

  // fetch all data from sample_airbnb database in mongodb sample
  const airbnbs = await Airbnb.find({});
  return NextResponse.json({ success: true, data: airbnbs });
}


// POST
export async function POST(request: Request) {
  await dbConnect();

  // create a new document in the sample_airbnb collection
  const newAirbnb = new Airbnb(request.body);

  // save the new document
  newAirbnb.save(function (err: any, airbnb: any) {
    if (err) return console.error(err);
    console.log(airbnb.name + " saved to sample_airbnb collection.");
  });

  // return the new document
  return NextResponse.json({ success: true, data: newAirbnb });
}