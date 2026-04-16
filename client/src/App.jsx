import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { GuardDashboard } from './pages/GuardDashboard';
import { History } from './pages/History';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>
                    
                    <Route element={<MainLayout />}>
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                        <Route element={<ProtectedRoute allowedRoles={['guard', 'admin']} />}>
                            <Route path="/guard" element={<GuardDashboard />} />
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/history" element={<History />} />
                        </Route>
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
