import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  body: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  entryId: {
    type: String,
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);