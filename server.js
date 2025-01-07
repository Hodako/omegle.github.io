const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store active users and their socket IDs
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    users.set(userId, socket.id);
    io.emit('users-update', Array.from(users.keys()));
  });

  socket.on('call-user', ({ to, signal, from }) => {
    io.to(users.get(to)).emit('incoming-call', {
      signal,
      from
    });
  });

  socket.on('answer-call', ({ to, signal }) => {
    io.to(users.get(to)).emit('call-accepted', signal);
  });

  socket.on('send-message', ({ to, message }) => {
    io.to(users.get(to)).emit('receive-message', {
      from: socket.id,
      message
    });
  });

  socket.on('disconnect', () => {
    let disconnectedUser;
    users.forEach((value, key) => {
      if (value === socket.id) disconnectedUser = key;
    });
    users.delete(disconnectedUser);
    io.emit('users-update', Array.from(users.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
