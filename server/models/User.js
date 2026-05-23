const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  dob: { type: Date, required: true },
  password: { type: String }, // Optional when using Firebase Auth
  firebaseUid: { type: String, unique: true, sparse: true },
  profilePicture: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky' },
  bio: { type: String, default: 'Jai Hind! Proud Indian.' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedReels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reel' }],
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
