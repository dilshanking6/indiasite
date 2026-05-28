const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const reelSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  comments: [commentSchema],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  mediaType: {
    type: String,
    enum: ['video', 'image'],
    default: 'video',
  },
  musicName: { type: String, default: 'Original Audio - India Site' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reel', reelSchema);
