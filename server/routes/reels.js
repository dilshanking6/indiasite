const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Reel = require('../models/Reel');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'india-site-content',
    resource_type: 'auto', // Auto detect if it's image or video
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for 1-2 min videos
  }
});

// Get all reels (Videos)
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find({ mediaType: 'video' })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts (Images)
router.get('/posts', async (req, res) => {
  try {
    const posts = await Reel.find({ mediaType: 'image' })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like/Unlike a reel
router.post('/:id/like', auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const userId = req.user.id;
    
    const index = reel.likedBy.indexOf(userId);
    let isLiked = false;
    if (index === -1) {
      reel.likedBy.push(userId);
      reel.likes += 1;
      isLiked = true;

      // Create notification
      if (reel.user && reel.user.toString() !== userId) {
        await Notification.create({
          recipient: reel.user,
          sender: userId,
          type: 'like',
          reelId: reel._id
        });
      }
    } else {
      reel.likedBy.splice(index, 1);
      reel.likes -= 1;
    }
    
    await reel.save();
    res.json({ likes: reel.likes, liked: isLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comment on a reel
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const userId = req.user.id;
    
    reel.comments.push({ text: req.body.text, user: userId });
    await reel.save();

    // Create notification
    if (reel.user && reel.user.toString() !== userId) {
      await Notification.create({
        recipient: reel.user,
        sender: userId,
        type: 'comment',
        reelId: reel._id
      });
    }

    const updatedReel = await Reel.findById(reel._id).populate('comments.user', 'username profilePicture');
    res.json(updatedReel.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save/Unsave a reel
router.post('/:id/save', auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const userId = req.user.id;
    const index = reel.savedBy.indexOf(userId);
    const user = await User.findById(userId);
    
    if (index === -1) {
      reel.savedBy.push(userId);
      user.savedReels.addToSet(reel._id);
    } else {
      reel.savedBy.splice(index, 1);
      user.savedReels.pull(reel._id);
    }
    
    await reel.save();
    await user.save();
    res.json({ saved: index === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count a reel view
router.post('/:id/view', async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    res.json({ views: reel.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload a new post (Reel or Photo)
router.post('/upload', auth, upload.single('media'), async (req, res) => {
  try {
    const { caption, musicName } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo or video' });
    }

    const newReel = new Reel({
      caption,
      videoUrl: req.file.path,
      publicId: req.file.filename,
      user: req.user.id,
      mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      musicName: musicName || (req.file.mimetype.startsWith('video') ? 'Original Audio - India Site' : undefined)
    });

    const savedReel = await newReel.save();
    res.status(201).json(savedReel);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
