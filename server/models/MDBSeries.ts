import { Series } from "@/models/series";
import mongoose, { Schema, SchemaType } from "mongoose";

const SeriesSchema = new mongoose.Schema<Series>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    episodes: [{ type: Schema.Types.ObjectId, required: false }],
    cover_image_url: { type: String, required: false },
    banner_image_url: { type: String, required: false },
  },
  { 
    timestamps: true,
    collection: "series",
  }
);

export default mongoose.models.Series || mongoose.model("Series", SeriesSchema);
