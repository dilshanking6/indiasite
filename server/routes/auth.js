const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Verification = require('../models/Verification');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email OTP
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Verification.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    const mailOptions = {
      from: `"India Site" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your India Site account',
      text: `Your verification code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Email OTP
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Verification.findOne({ email, otp: otp.trim() });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'Verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check Exists
router.post('/check-exists', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (username) {
      const u = await User.findOne({ username });
      if (u) return res.json({ exists: true, message: 'Username taken' });
    }
    if (email) {
      const u = await User.findOne({ email });
      if (u) return res.json({ exists: true, message: 'Email taken' });
    }
    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, dob, firebaseUid } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      phoneNumber: phoneNumber?.trim() || undefined,
      dob,
      firebaseUid
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login (Supports Phone, Email, Username)
router.post('/login', async (req, res) => {
  try {
    const { email: identifier, password } = req.body;
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }, { phoneNumber: identifier }] 
    });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }, { phoneNumber: identifier }] 
    });
    if (!user || !user.email) return res.status(404).json({ message: 'User/Email not found' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Verification.findOneAndUpdate({ email: user.email }, { otp, createdAt: new Date() }, { upsert: true });
    
    await transporter.sendMail({
      from: `"India Site" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Password',
      text: `OTP: ${otp}`
    });
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await Verification.findOne({ email, otp: otp.trim() });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();
    await Verification.deleteOne({ _id: record._id });
    res.json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
