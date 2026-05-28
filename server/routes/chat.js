const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Mock data or simple implementation since original was missing
// To properly restore, we need Message and ChatRoom models which I'll add back
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// Get all chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.user.id })
      .populate('participants', 'username profilePicture')
      .sort({ updatedAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or get room
router.post('/room', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    let room = await ChatRoom.findOne({
      participants: { $all: [req.user.id, targetUserId] },
      isGroup: false
    }).populate('participants', 'username profilePicture');

    if (!room) {
      room = new ChatRoom({ participants: [req.user.id, targetUserId] });
      await room.save();
      room = await ChatRoom.findById(room._id).populate('participants', 'username profilePicture');
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages
router.get('/messages/:roomId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message
router.post('/send', auth, async (req, res) => {
  try {
    const { roomId, text } = req.body;
    const newMessage = new Message({
      room: roomId,
      sender: req.user.id,
      text
    });
    await newMessage.save();
    await ChatRoom.findByIdAndUpdate(roomId, { updatedAt: Date.now() });
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
