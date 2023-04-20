import { NextRequest, NextResponse } from "next/server";

import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";

import mongoose from "mongoose";

import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export async function GET(request: Request) {
  try {
    const db = await dbConnect();

    // console.log("hey");
    const searchParams = new URLSearchParams(request.url.split("?")[1]);
    const searchingEmail = searchParams.get("email");

    const data = await MDBUser.findOne({
      email: searchingEmail,
    });

    console.log("data after finding one")
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // return new Response(error, { status: 500 })
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    // create new user in db
    const db = await dbConnect();
    const body = await request.json();

    const existingUser = await MDBUser.findOne({ email: body.email })

    if (existingUser) {
      // return NextResponse.json({ error: "User already exists" }, { status: 400 });
      return NextResponse.json(existingUser, { status: 200 });
    }

    console.log(process.env.STRIPE_SECRET_KEY);

    // new user has been created
    const newStripeCustomer = await stripe.customers.create({
      email: body.email,
      name: body.name,
    });

    const newUser = new MDBUser({
      _id: new mongoose.Types.ObjectId(),
      name: body.name,
      email: body.email,
      profile_image_url: body.picture,
      stripe_customer_id: newStripeCustomer.id,
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// update
export async function PUT(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const filter = { _id: body._id }
    const update = body;

    const testFilter = { _id: "6436f3032b67ae01b9c884bb" }
    const testUpdate = { 
      name: "Mark Rachapoom",
      bio: "20, building this app you're using",
      profile_image_url: "https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg",
      banner_image_url: "https://pbs.twimg.com/profile_banners/727846811713437696/1670934193/1500x500"
    }


    const updatedUser = await MDBUser.findOneAndUpdate(filter, body);

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}