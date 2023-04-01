
import mongoose from 'mongoose';
// import EntryLocation from './EntryLocation';

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: false,
  },
  coverImageURL: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  // location: EntryLocation,
  weather: {
    type: String,
    required: false,
  },
  mood: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

