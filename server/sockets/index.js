const jwt = require('jsonwebtoken');

const initializeSocket = (io) => {
  // Use Middleware for socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.name} (${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user.name} (${socket.id})`);
    });
  });
};

module.exports = initializeSocket;
