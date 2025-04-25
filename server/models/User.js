const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  phoneNumber: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
