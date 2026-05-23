const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Verification = require('../models/Verification');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// Send Email OTP
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Attempting to send OTP to: ${email}`);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Verification.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true }
    );
    console.log('OTP saved to database');

    // Send Mail logic
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"India Site" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your India Site Verification Code',
        text: `Your verification code is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #000080; text-align: center;">Namaste!</h2>
            <p>Aapka India Site verification code niche diya gaya hai:</p>
            <div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${otp}
            </div>
            <p>Ye code 10 minutes ke liye valid hai.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return res.json({ message: 'OTP sent successfully to your email.' });
    } else {
      console.error('Email credentials missing in .env');
      throw new Error('Email configuration missing on server');
    }

  } catch (err) {
    console.error('Full Auth Error Details:', err);
    res.status(500).json({ 
      message: 'Failed to send OTP. Please check your internet or email settings.',
      error: err.message
    });
  }
});

// Verify Email OTP
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanOtp = otp.trim();
    
    console.log(`Verifying OTP for ${email}: ${cleanOtp}`);
    
    const record = await Verification.findOne({ email, otp: cleanOtp });
    
    if (!record) {
      console.log('OTP Record not found or expired');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Success, delete the record
    await Verification.deleteOne({ _id: record._id });
    console.log('OTP verified successfully');
    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Check if username/email/phone exists
router.post('/check-exists', async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    
    const userByUsername = await User.findOne({ username });
    if (userByUsername) return res.json({ exists: true, message: 'Username already taken' });

    const userByEmail = await User.findOne({ email });
    if (userByEmail) return res.json({ exists: true, message: 'Email already registered' });

    const userByPhone = await User.findOne({ phoneNumber: phone });
    if (userByPhone) return res.json({ exists: true, message: 'Phone number already registered' });

    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, dob, firebaseUid } = req.body;
    
    // Build dynamic query for existence check
    const existingCheck = [];
    if (email) existingCheck.push({ email });
    if (username) existingCheck.push({ username });
    if (phoneNumber) existingCheck.push({ phoneNumber });

    if (existingCheck.length > 0) {
      let user = await User.findOne({ $or: existingCheck });
      if (user) {
        let field = user.email === email ? 'Email' : (user.username === username ? 'Username' : 'Phone');
        return res.status(400).json({ message: `${field} already exists` });
      }
    }

    const newUser = new User({ 
      username, 
      email, 
      password, 
      phoneNumber, 
      dob, 
      firebaseUid 
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: newUser._id, 
        username, 
        email, 
        phoneNumber,
        dob,
        profilePicture: newUser.profilePicture 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email: identifier, password } = req.body;
    
    // Allow identifier to be email or username
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// AI Chat Route
router.post('/ai-chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "Namaste! AI services are currently being upgraded. Please add a GEMINI_API_KEY to the server to activate Bharat AI." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = context || "You are 'India Site AI', a helpful assistant for the India Site social network. Ground your answers in Indian values and the Bharat vibe.";
    
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAI:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('AI Route Error:', err);
    res.status(500).json({ message: "AI processing failed. Check API key or connection." });
  }
});

module.exports = router;
