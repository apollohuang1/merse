import mongoose, { Schema, SchemaType } from "mongoose";

interface IUser {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  banner_image_url: string;
  stripe_customer_id: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, required: false },
  profile_image_url: { type: String, required: false },
  banner_image_url: { type: String, required: false },
  stripe_customer_id: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);