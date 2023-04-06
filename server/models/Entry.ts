
import { Entry } from '@/models/entry';
import mongoose, { Schema } from 'mongoose';


const EntrySchema = new Schema<Entry>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  style_reference: { type: Object, required: true },
  content: { type: Object, required: true },
  characters: { type: [Object] , required: true },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

