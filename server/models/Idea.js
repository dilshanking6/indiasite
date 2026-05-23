const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'implemented'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Idea', ideaSchema);
