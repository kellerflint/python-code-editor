const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

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

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});