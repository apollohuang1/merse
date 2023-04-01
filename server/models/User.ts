const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  profileImageURL: String,
  birthDate: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);