import mongoose from "mongoose";


const AirbnbSchema = new mongoose.Schema({
  _id: String,
  listing_url: String,
  name: String,
  summary: String,
  space: String,
  description: String,
  neighborhood_overview: String,
  notes: String,
  transit: String,
  access: String,
  interaction: String,
  house_rules: String,
  property_type: String,
  room_type: String,
});

export default mongoose.models.Airbnb || mongoose.model("Airbnb", AirbnbSchema);


