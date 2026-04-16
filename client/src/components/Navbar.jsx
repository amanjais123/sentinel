import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { LogOut, User, Menu } from 'lucide-react';

export function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-brand-100 flex items-center justify-between sticky top-0 z-10 px-4 md:px-8">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="md:hidden !px-2" onClick={onMenuClick}>
                    <Menu size={24} className="text-brand-900" />
                </Button>
                <div className="md:hidden font-heading font-bold text-xl text-brand-900 tracking-tight">Sentinel</div>
            </div>
            <div className="hidden md:block">
                <h1 className="text-xl font-bold font-heading text-brand-900 m-0">Welcome back, {user?.name.split(' ')[0]}</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex flex-col text-right hidden sm:flex">
                    <span className="text-sm font-semibold text-brand-900">{user?.name}</span>
                    <span className="text-xs text-brand-500 capitalize font-medium">{user?.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-900">
                    <User size={20} />
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="ml-2 !px-2">
                    <LogOut size={20} />
                </Button>
            </div>
        </header>
    );
}
