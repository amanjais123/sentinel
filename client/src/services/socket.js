import { io } from 'socket.io-client';

// Extract base URL for socket connection (remove /api if it exists)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const socketURL = baseURL.replace(/\/api$/, ''); // e.g., http://localhost:5000

// Initialize socket instance, connect manually when needed
export const socket = io(socketURL, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem('sentinel_token');
        cb({ token });
    }
});
