import React, { useEffect, useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import { socket } from '../services/socket';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Check, X, Clock, Car } from 'lucide-react';

export function GuardDashboard() {
    const { vehicles, fetchVehicles, updateVehicleStatus, addVehicle, updateVehicle, loading } = useVehicleStore();
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchVehicles({ type: 'live' });
        
        const handleNewVehicle = (vehicle) => {
            addVehicle(vehicle);
        };
        
        const handleVehicleUpdate = (vehicle) => {
            updateVehicle(vehicle);
        };
        
        socket.on('newVehicle', handleNewVehicle);
        socket.on('vehicleUpdated', handleVehicleUpdate);
        
        return () => {
            socket.off('newVehicle', handleNewVehicle);
            socket.off('vehicleUpdated', handleVehicleUpdate);
        };
    }, []);

    const pendingVehicles = vehicles.filter(v => v.status === 'pending');
    
    if (loading && vehicles.length === 0) {
        return <div className="text-center py-12 text-brand-500 font-medium animate-pulse">Establishing secure connection...</div>;
    }

    const handleAction = async (id, status) => {
        setProcessingId(id);
        await updateVehicleStatus(id, status);
        setProcessingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-brand-900 tracking-tight">Active Queue</h1>
                    <p className="text-brand-600 mt-1 font-medium text-sm">Monitor and process incoming vehicles</p>
                </div>
                <div className="flex gap-4">
                    <Card className="!p-4 min-w-[120px] text-center border border-brand-100 flex flex-col items-center justify-center">
                        <div className="text-3xl font-heading font-bold text-status-warning">{pendingVehicles.length}</div>
                        <div className="text-xs text-brand-500 font-medium uppercase tracking-widest mt-1">Pending</div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingVehicles.length === 0 && !loading && (
                    <div className="col-span-full text-center py-24 bg-white/50 backdrop-blur rounded-2xl border border-brand-100/50">
                        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-400 mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-brand-900">Queue Cleared</h3>
                        <p className="text-brand-500 text-sm mt-1">All entries have been processed successfully.</p>
                    </div>
                )}
                
                {pendingVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-100/50 flex flex-col z-0">
                        <div className="absolute top-4 right-4 z-10">
                            <Badge variant="warning">Pending clearance</Badge>
                        </div>
                        
                        <div className="h-40 -mx-6 -mt-6 mb-4 relative bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-black/20" />
                            <Car size={64} className="text-white/20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-4 left-6 z-10 text-white">
                                <div className="text-sm font-semibold opacity-90 uppercase tracking-widest leading-none mb-1">{vehicle.type}</div>
                                <div className="font-mono text-3xl font-bold tracking-tight">{vehicle.licensePlate || vehicle.vehicleNumber}</div>
                            </div>
                        </div>
                        
                        <div className="flex-1 text-sm text-brand-600 font-medium">
                            <div className="flex items-center gap-2 mt-2">
                                <Clock size={16} className="text-brand-400" />
                                {new Date(vehicle.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-50">
                            <Button 
                                variant="secondary" 
                                className="flex-1 text-status-danger hover:bg-status-danger hover:text-white"
                                onClick={() => handleAction(vehicle.id, 'rejected')}
                                disabled={processingId === vehicle.id}
                            >
                                <X size={18} className="mr-2" /> Reject
                            </Button>
                            <Button 
                                variant="primary" 
                                className="flex-1 bg-status-safe hover:bg-green-600 text-white shadow-status-safe/20"
                                onClick={() => handleAction(vehicle.id, 'approved')}
                                disabled={processingId === vehicle.id}
                            >
                                <Check size={18} className="mr-2" /> Approve
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
