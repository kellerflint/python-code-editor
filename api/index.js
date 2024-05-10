const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Basic setup

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

// Enable CORS

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB connection

const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pf0frdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let currentCode = '';

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the current code state to the newly connected client
  socket.emit('initialCode', currentCode);

  // Listen for code changes from clients
  socket.on('codeChange', (code) => {
    currentCode = code; // Update the current code state
    // Broadcast the code update to all other clients
    socket.broadcast.emit('codeUpdate', code);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/api/data', (req, res) => {
  // Access the authenticated user information
  const userId = req.user.sub;
  res.json({ userId });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});