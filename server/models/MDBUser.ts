import mongoose, { Schema, SchemaType } from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profile_image_url: { type: String, required: false },
});

export default mongoose.model('User', UserSchema);