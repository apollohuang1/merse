
import { Entry, Scene } from '@/models/entry';
import mongoose, { Schema } from 'mongoose';


const SceneSchema = new mongoose.Schema<Scene>({
  _id: { type: String, required: true },
  image_base64: { type: String, required: true },
  prompt: { type: String, required: true },
  displayed_text: { type: String, required: true },
});


const EntrySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  style_reference: { type: Object, required: true },
  // content: { type: Object, required: true }, // tiptap content
  content: { type: String, required: true }, // tiptap html
  characters: { type: [Object] , required: true },
  scenes: { type: [SceneSchema], required: true },
  canvas: { type: Object, required: true },
  cover: { type: Object, required: true },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, required: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  // published_at: { type: Date, required: true },
  // is_published: { type: Boolean, required: true },
  // is_deleted: { type: Boolean, required: true },
  // is_private: { type: Boolean, required: true },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);