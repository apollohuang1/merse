import MDBEntry from "@/server/models/MDBEntry";
import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";




// migrate all
export async function POST(request: NextRequest) {

  try {
    // const allUsersResponse = await axios({
    //   method: "GET",
    //   url: "https://comic.merse.co/api/migrate/users",
    // })

    const allEntriesResponse = await axios({
      method: "GET",
      url: "https://comic.merse.co/api/migrate/entries",
    })

    const allEntries = allEntriesResponse.data;
    // const allUsers = allUsersResponse.data;

    await dbConnect();

    // migrate all users to mongodb
    // for (const user of allUsers) {
    //   await MDBUser.create(user);
    // }

    // migrate all entries to mongodb
    for (const entry of allEntries) {
      await MDBEntry.create(entry);
    }

    return NextResponse.json("success", {status: 200});
  } catch (error) {
    return NextResponse.json(error, {status: 500});
  }

  // const body = await request.body;

  // // get api key from bear token
  // const token = request.headers.get("authorization");

  // // if key is not process.env.MERSE_API_KEY
  // if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  // const allUsers = await axios.get("https://comic.merse.co/api/migrate/users");
  // const allEntries = await axios.get("https://comic.merse.co/api/migrate/entries");

}