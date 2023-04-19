
import { Entry, Scene } from '@/models/entry';
import mongoose, { Schema } from 'mongoose';


const SceneSchema = new mongoose.Schema<Scene>({
  _id: { type: String, required: true },
  image_base64: { type: String, required: true },
  text: { type: String, required: true },
});


const EntrySchema = new mongoose.Schema<Entry>({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  style_reference: { type: Object, required: true },
  content: { type: Object, required: true }, // tiptap content
  characters: { type: [Object] , required: true },
  scenes: { type: [SceneSchema], required: true },
  cover: { type: Object, required: true },
  spotify_playlist_id: { type: String, required: false },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, required: false },
  // published_at: { type: Date, required: true },
  // is_published: { type: Boolean, required: true },
  // is_deleted: { type: Boolean, required: true },
  // is_private: { type: Boolean, required: true },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);