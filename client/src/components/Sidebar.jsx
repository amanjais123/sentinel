import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History as HistoryIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export function Sidebar() {
    const { user } = useAuth();

    const links = [
        { name: 'Dashboard', to: user?.role === 'admin' ? '/admin' : '/guard', icon: LayoutDashboard },
        { name: 'History', to: '/history', icon: HistoryIcon },
    ];

    return (
        <aside className="w-64 bg-white border-r border-brand-100 flex flex-col hidden md:flex">
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-brand-900 rounded-lg text-white">
                    <ShieldCheck size={24} />
                </div>
                <span className="font-heading font-bold text-xl text-brand-900 tracking-tight">Sentinel</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                                isActive 
                                    ? "bg-brand-50 text-brand-900" 
                                    : "text-brand-600 hover:bg-brand-50 hover:text-brand-900"
                            )}
                        >
                            <Icon size={20} className="group-hover:scale-110 transition-transform" />
                            {link.name}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
