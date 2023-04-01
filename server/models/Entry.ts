
import mongoose from 'mongoose';
import EntryLocation from './EntryLocation';

const EntrySchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  image: String,
  coverImageURL: String,
  tags: [String],
  rating: Number,
  location: EntryLocation,
  weather: String,
  mood: String,
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

