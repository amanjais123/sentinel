import React, { useEffect, useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Car, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AdminDashboard() {
    const { vehicles, fetchVehicles } = useVehicleStore();
    const [statsData, setStatsData] = useState(null);

    useEffect(() => {
        fetchVehicles({ type: 'all' });
        
        // Optionally fetch real stats if available, otherwise fallback to local calculation
        api.vehicles.getStats().then(data => {
            setStatsData(data);
        }).catch(() => {
            // If endpoint doesn't exist yet or fails, fallback will be used via the vehicles array
            console.log('Using local stats calculation');
        });
    }, []);

    // Fallback static calculations if API stats fail
    const fallbackStats = [
        { title: 'Total Entries', value: vehicles.length, icon: Car, color: 'text-brand-600', bg: 'bg-brand-100' },
        { title: 'Approved', value: vehicles.filter(v => v.status === 'approved').length, icon: CheckCircle2, color: 'text-status-safe', bg: 'bg-status-safe/10' },
        { title: 'Rejected', value: vehicles.filter(v => v.status === 'rejected').length, icon: XCircle, color: 'text-status-danger', bg: 'bg-status-danger/10' },
        { title: 'Pending Review', value: vehicles.filter(v => v.status === 'pending').length, icon: Clock, color: 'text-status-warning', bg: 'bg-status-warning/10' },
    ];

    // Using stats from backend if returned in the shape { total, approved, rejected, pending }
    const displayStats = statsData ? [
        { title: 'Total Entries', value: statsData.total, icon: Car, color: 'text-brand-600', bg: 'bg-brand-100' },
        { title: 'Approved', value: statsData.approved, icon: CheckCircle2, color: 'text-status-safe', bg: 'bg-status-safe/10' },
        { title: 'Rejected', value: statsData.rejected, icon: XCircle, color: 'text-status-danger', bg: 'bg-status-danger/10' },
        { title: 'Pending Review', value: statsData.pending, icon: Clock, color: 'text-status-warning', bg: 'bg-status-warning/10' },
    ] : fallbackStats;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-brand-900 tracking-tight">System Overview</h1>
                <p className="text-brand-600 mt-1 font-medium text-sm">Key metrics and recent activity across the facility</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="flex items-center gap-6">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-heading font-bold text-brand-900 leading-none">{stat.value}</div>
                                <div className="text-xs text-brand-500 font-bold uppercase tracking-wider mt-2">{stat.title}</div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="!p-0 overflow-hidden border border-brand-100/50 bg-white/50">
                <div className="p-6 border-b border-brand-100/50 flex justify-between items-center bg-white">
                    <h3 className="font-heading font-bold text-lg text-brand-900">Recent Activity Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-brand-50/30 text-brand-600 border-b border-brand-100/50">
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Vehicle Number</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Type</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100/50 bg-white/40">
                            {vehicles.slice(0, 5).map(v => (
                                <tr key={v.id} className="hover:bg-brand-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-brand-900 text-base">{v.vehicleNumber || v.licensePlate}</td>
                                    <td className="px-6 py-4 capitalize font-medium text-brand-600">{v.type}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={v.status === 'approved' ? 'success' : v.status === 'rejected' ? 'danger' : 'warning'}>
                                            {v.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right text-brand-500 font-medium">
                                        {new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
