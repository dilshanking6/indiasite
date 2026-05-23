const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const auth = require('../middleware/auth');

// Submit an idea
router.post('/submit', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const newIdea = new Idea({
      user: req.user.id,
      text
    });
    await newIdea.save();
    res.status(201).json({ message: 'Idea submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all ideas (Admin only - for now just protected by auth)
router.get('/all', auth, async (req, res) => {
  try {
    const ideas = await Idea.find().populate('user', 'username profilePicture').sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
