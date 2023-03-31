import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  _id: String,
  name: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);


