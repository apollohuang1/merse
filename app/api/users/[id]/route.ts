import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { getLastIdFromUrl } from "@/util/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    // get api key from bear token
   const token = request.headers.get("authorization");

   // if key is not process.env.MERSE_API_KEY
   if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
     return new Response("Unauthorized", { status: 401 });
   }

    await dbConnect();
    
    // get the final route from pathname
    const usernameOrId = getLastIdFromUrl(request.url);

    const query = {
      $or: [
        { username: usernameOrId },
        { _id: usernameOrId }
      ],
    };

    const userData = await MDBUser.findOne(query);

    // find user by username or id
    // const userData = await MDBUser.find({
    //   $or: [
    //     { username: usernameOrId },
    //     { _id: usernameOrId }
    //   ]
    // })

    // const userData = await MDBUser.findById(userId);

    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    console.log("Failed to fetch user data", error?.message);
    return NextResponse.json({error: error.message, test: "lmao"}, { status: 500 });
  }
}