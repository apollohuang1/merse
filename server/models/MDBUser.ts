import { IUser } from "@/models/user";
import mongoose, { Schema, SchemaType } from "mongoose";

const UserSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  username: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, required: false },
  profile_image_url: { type: String, required: false },
  banner_image_url: { type: String, required: false },
  stripe_customer_id: { type: String, required: false },
  stripe_subscription_id: { type: String, required: false },
  stripe_customer_email: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);