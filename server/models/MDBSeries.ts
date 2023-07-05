import { Series } from "@/models/series";
import mongoose, { Schema, SchemaType, Types } from "mongoose";

const SeriesSchema = new mongoose.Schema<Series>(
  {
    title: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    genres: { type: [String], required: true },
    description: { type: String, required: true },
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode", required: false }],
    cover_image_url: { type: String, required: false },
    banner_image_url: { type: String, required: false },
  },
  {
    timestamps: true,
    collection: "series",
  }
);

export default mongoose.models.Series || mongoose.model("Series", SeriesSchema);
