
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
