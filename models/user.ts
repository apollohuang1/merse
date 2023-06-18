import mongoose from "mongoose";

export interface User {
  // _id: mongoose.Types.ObjectId;
  _id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  banner_image_url: string;
  // followers: mongoose.Types.ObjectId[];
  followers: User[];
  followings: User[];
  // following: mongoose.Types.ObjectId[];
  joined_at: Date;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_customer_email: string;
}