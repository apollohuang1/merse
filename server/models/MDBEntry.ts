
import { Entry } from '@/models/entry';
import mongoose, { Schema } from 'mongoose';


const EntrySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  style_reference: { type: Object, required: true },
  content: { type: Object, required: true },
  characters: { type: [Object] , required: true },
  cover: { type: Object, required: true },
});

export default mongoose.model('Entry', EntrySchema);