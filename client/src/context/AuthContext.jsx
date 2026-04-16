import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('sentinel_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Effect for socket lifecycle management based on auth state
    useEffect(() => {
        if (user) {
            socket.connect();
        } else {
            socket.disconnect();
        }
        
        return () => {
            socket.disconnect();
        };
    }, [user]);

    const login = async (username, password) => {
        const { user, token } = await api.auth.login(username, password);
        localStorage.setItem('sentinel_token', token);
        localStorage.setItem('sentinel_user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('sentinel_token');
        localStorage.removeItem('sentinel_user');
        setUser(null);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-brand-50 text-brand-900 font-medium">Loading details...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
