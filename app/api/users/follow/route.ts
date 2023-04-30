import MDBUser from "@/server/models/MDBUser";
import dbConnect from "@/server/utils/dbConnect";
import { getLastIdFromUrl } from "@/util/helper";
import mongoose, { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


/**
 * Follow or unfollow a user
 * 
 * @param request
 * @returns 
 * body: {
 * action: 'follow' | 'unfollow',
 * currentUserId: string,
 * targetUserId: string,
 * }
 */

export async function POST(request: NextRequest) {

  await dbConnect();
  const body = await request.json();

  const action = body.action;
  const userId = body.userId;
  const targetUserId = body.targetUserId;

  if (userId === targetUserId) {
    return NextResponse.json({ error: "You can't follow or unfollow yourself" }, { status: 400 });
  }

  try {

    const user = await MDBUser.findById(new mongoose.Types.ObjectId(userId));
    const targetUser = await MDBUser.findById(new mongoose.Types.ObjectId(targetUserId));

    if (!user || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check if following and followers field exist, if not put them in
    if (!user.followings && !user.followers) {
      console.log('user followings and followers not found');
      await MDBUser.findByIdAndUpdate({ _id: userId }, { followings: [], followers: [] });
    }

    if (!targetUser.followings && !targetUser.followers) {
      console.log('target user followings and followers not found');
      await MDBUser.findByIdAndUpdate({ _id: targetUserId }, { followings: [], followers: [] });
    }

    if (action === 'follow') {
      if (!targetUser?.follwings?.includes(userId)) {

        user.followings.push(targetUserId);
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();
        return NextResponse.json({ message: 'User followed successfully' }, { status: 200 });
      } else {
        console.log('user already following target user');
        return NextResponse.json({ error: 'You are already following this user' }, { status: 400 });
      }
    } else if (action === 'unfollow') {
      user.followings = user.followings.filter((id: any) => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter((id: any) => id.toString() !== userId);

      await user.save();
      await targetUser.save();
      return NextResponse.json({ message: 'User unfollowed successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    // console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}