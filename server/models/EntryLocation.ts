import mongoose from "mongoose";

const EntryLocationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
});

export default mongoose.models.EntryLocation || mongoose.model("EntryLocation", EntryLocationSchema);