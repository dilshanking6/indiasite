const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

const admin = require('firebase-admin');

// Handle Firebase Service Account
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (err) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    console.error('Firebase service account key not found!');
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reels', require('./routes/reels'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/chat', require('./routes/chat'));

// Basic Route
app.get('/', (req, res) => {
  res.send('India Site API is running with Namaste!');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
