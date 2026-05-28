const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const Reel = require('../models/Reel');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'india-site-profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Update profile picture
router.put('/update-avatar', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .populate('blockedUsers', 'username profilePicture');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get saved reels/posts for current user
router.get('/saved-content', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedReels');
    const saved = await Reel.find({ _id: { $in: user.savedReels || [] } })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/edit', auth, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findById(req.user.id);

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: 'Username taken' });
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Follow/Unfollow user
router.post('/follow/:id', auth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (currentUser.blockedUsers?.includes(userToFollow._id) || userToFollow.blockedUsers?.includes(currentUser._id)) {
      return res.status(403).json({ message: 'Follow is not available for blocked users' });
    }

    const index = userToFollow.followers.indexOf(currentUser._id);
    let isFollowing = false;
    if (index === -1) {
      // Follow
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);
      isFollowing = true;

      // Create notification
      await Notification.create({
        recipient: userToFollow._id,
        sender: currentUser._id,
        type: 'follow'
      });
    } else {
      // Unfollow
      userToFollow.followers.splice(index, 1);
      const followingIndex = currentUser.following.indexOf(userToFollow._id);
      currentUser.following.splice(followingIndex, 1);
    }

    await userToFollow.save();
    await currentUser.save();

    res.json({ following: isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block/Unblock user
router.post('/block/:id', auth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const index = currentUser.blockedUsers.indexOf(targetUser._id);
    let blocked = false;

    if (index === -1) {
      currentUser.blockedUsers.push(targetUser._id);
      currentUser.following.pull(targetUser._id);
      currentUser.followers.pull(targetUser._id);
      targetUser.following.pull(currentUser._id);
      targetUser.followers.pull(currentUser._id);
      blocked = true;
    } else {
      currentUser.blockedUsers.splice(index, 1);
    }

    await currentUser.save();
    await targetUser.save();
    res.json({ blocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
