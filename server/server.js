require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const initializeSocket = require('./sockets/index');

const app = express();
const server = http.createServer(app);

// Allow CORS for the frontend origin
app.use(cors({
  origin: 'https://sentinel-asw.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Init Socket.io
const io = new Server(server, {
  cors: {
    origin: 'https://sentinel-asw.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
initializeSocket(io);

// Make io accessible in controllers
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'Platform is online.' }));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
