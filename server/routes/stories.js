const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Story = require('../models/Story');
const auth = require('../middleware/auth');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'india-site-stories',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

// Upload story
router.post('/upload', auth, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newStory = new Story({
      user: req.user.id,
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all active stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
