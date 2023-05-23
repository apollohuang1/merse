import { User } from "@/models/user";
import mongoose, { Schema, SchemaType } from "mongoose";

const UserSchema = new mongoose.Schema<User>({
  _id: { type: String, required: false },
  username: { type: String, required: false, unique: true, trim: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  bio: { type: String, required: false },
  profile_image_url: { type: String, required: false },
  banner_image_url: { type: String, required: false },
  followers: [{ type: Schema.Types.ObjectId, required: false }],
  followings: [{ type: Schema.Types.ObjectId, required: false }],
  joined_at: { type: Date, required: false },
  stripe_customer_id: { type: String, required: false },
  stripe_subscription_id: { type: String, required: false },
  stripe_customer_email: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
// export default mongoose.model("User", UserSchema);
