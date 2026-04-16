import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Login() {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(credentials.username, credentials.password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-brand-900/5 overflow-hidden border border-brand-100">
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-brand-900">Sentinel</h1>
                        <p className="text-brand-500 mt-2 text-sm font-medium">Facility Monitoring Access</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
                    {error && (
                        <div className="p-3 bg-status-danger/10 text-status-danger rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-brand-50 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                                value={credentials.username}
                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-brand-50 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                                value={credentials.password}
                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full !rounded-xl" disabled={loading} size="lg">
                        {loading ? <Loader2 className="animate-spin text-white" size={20} /> : 'Authenticate'}
                    </Button>
                    
                    <div className="text-center text-xs text-brand-600 space-y-2 font-medium bg-brand-50 p-4 rounded-xl">
                        <p>Roles Demo Login</p>
                        <div className="flex justify-center gap-4 text-xs font-mono">
                            <span>admin/admin</span>
                            <span>guard/guard</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
