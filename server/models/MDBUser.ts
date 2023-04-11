import { User } from "@/models/user";
import mongoose, { Schema, SchemaType } from "mongoose";

const UserSchema = new Schema<User>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profile_image_url: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);