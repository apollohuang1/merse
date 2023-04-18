import mongoose, { Schema, SchemaType } from "mongoose";

interface IUser {
  _id: string;
  name: string;
  email: string;
  profile_image_url: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profile_image_url: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);