import React, { useEffect, useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search, Car } from 'lucide-react';

export function History() {
    const { vehicles, fetchVehicles } = useVehicleStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchVehicles({ type: 'all' });
    }, []);

    const filtered = vehicles.filter(v => {
        const num = v.vehicleNumber || v.licensePlate || '';
        return num.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-brand-900 tracking-tight">Access History</h1>
                    <p className="text-brand-600 mt-1 font-medium text-sm">Complete log of all monitored entries</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by vehicle number..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-100 bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-sm text-brand-900 shadow-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-3">
                {filtered.map(v => (
                    <Card key={v.id} className="!p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow border border-brand-50 bg-white">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className="w-16 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-brand-500 shrink-0 shadow-sm">
                                <Car size={24} />
                            </div>
                            <div>
                                <div className="font-mono font-bold text-brand-900 text-lg tracking-tight">{v.vehicleNumber || v.licensePlate}</div>
                                <div className="text-xs font-semibold text-brand-500 uppercase tracking-widest mt-0.5">{v.type}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                            <div className="text-left sm:text-right">
                                <div className="text-sm font-semibold text-brand-900">{new Date(v.entryTime).toLocaleDateString()}</div>
                                <div className="text-xs font-medium text-brand-500 mt-0.5">{new Date(v.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</div>
                            </div>
                            <Badge variant={v.status === 'approved' ? 'success' : v.status === 'rejected' ? 'danger' : 'warning'} className="w-24 justify-center py-1">
                                {v.status}
                            </Badge>
                        </div>
                    </Card>
                ))}
                
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-brand-500 font-medium">
                        No entries found matching '{search}'.
                    </div>
                )}
            </div>
        </div>
    );
}
