import mongoose from "mongoose";

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  banner_image_url: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_customer_email: string;
}