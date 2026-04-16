import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL
});

// Add interceptor to automatically add JWT
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sentinel_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const api = {
    auth: {
        login: async (username, password) => {
            // Usually login is a POST to something like /auth/login
            // Since the specific login URL was not provided in the requirements, guessing /auth/login
            const response = await axiosInstance.post('/auth/login', { username, password });
            return response.data; // expects { user, token }
        }
    },
    vehicles: {
        getLive: async () => {
            const response = await axiosInstance.get('/vehicles/live');
            return response.data;
        },
        getAll: async () => {
            const response = await axiosInstance.get('/vehicles/all');
            return response.data;
        },
        approve: async (id) => {
            const response = await axiosInstance.post(`/vehicles/${id}/approve`);
            return response.data;
        },
        reject: async (id) => {
            const response = await axiosInstance.post(`/vehicles/${id}/reject`);
            return response.data;
        },
        getStats: async () => {
            const response = await axiosInstance.get('/vehicles/stats');
            return response.data;
        },
        getAnalytics: async () => {
            const response = await axiosInstance.get('/vehicles/analytics');
            return response.data;
        }
    }
};
