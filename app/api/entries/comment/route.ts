import { Comment, Entry } from "@/models/entry";
import MDBEntry from "@/server/models/MDBEntry";
import MDBUser from "@/server/models/MDBUser";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


/**
 * 
 * @param request 
 * data: {
 * entryId: string,
 * comment: string,
 * userId: string
 * }
 * @returns 
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // guard id
    if (!body?.entryId) {
      return new Response("No entry id provided", { status: 400 });
    }

    if (!body?.comment) {
      return new Response("No comment provided", { status: 400 });
    }

    if (!body?.userId) {
      return new Response("No user id provided", { status: 400 });
    }

    const newComment: Comment = {
      _id: new mongoose.Types.ObjectId().toString(),
      content: body.comment,
      author: body.userId,
      created_at: new Date(),
      likes: [],
      replies: [],
    };

    const updatedDocument = await MDBEntry.findByIdAndUpdate(
      body.entryId,
      {
        $push: {
          comments: newComment, 
        }
      },
      { new: true }
    )
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username name profile_image_url _id",
        model: MDBUser
      },
    })
    .exec();

    if (!updatedDocument) {
      return new Response("No entry found with id: " + body.entryId, {
        status: 404,
      });
    }

    // return array of updated comments
    return NextResponse.json(updatedDocument.comments, { status: 200 });
  } catch (error: any) {
    console.log("Failed to comment entry: ", error.message);
    return NextResponse.json(error.message, { status: 500 });
  }
}
