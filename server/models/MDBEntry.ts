
import { Comment, Entry, Reply, Scene } from '@/models/entry';
import mongoose, { Schema } from 'mongoose';


const SceneSchema = new mongoose.Schema<Scene>({
  _id: { type: String, required: true },
  image_base64: { type: String, required: false },
  prompt: { type: String, required: false },
  displayed_text: { type: String, required: false },
});

const CommentSchema = new mongoose.Schema<Comment>({
  _id: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
  replies: [{ type: [Object], ref: "Reply", required: false }],
});

const ReplySchema = new mongoose.Schema<Reply>({
  _id: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: false },
  content: { type: String, required: false },
  created_at: { type: Date, required: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
});


const EntrySchema = new mongoose.Schema<Entry>({
  _id: { type: String, required: false },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: { type: String, required: false },
  style_reference: { type: Object, required: false },
  // content: { type: Object, required: true }, // tiptap content
  content: { type: String, required: false }, // tiptap html
  characters: { type: [Object] , required: false },
  scenes: { type: [SceneSchema], required: false },
  canvas: { type: Object, required: false },
  cover: { type: Object, required: false },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, required: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
  comments: [{ type: CommentSchema, ref: "Comment", required: false }],
  // published_at: { type: Date, required: true },
  // is_published: { type: Boolean, required: true },
  // is_deleted: { type: Boolean, required: true },
  // is_private: { type: Boolean, required: true },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);