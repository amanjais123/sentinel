import { create } from 'zustand';
import { api } from '../services/api';

export const useVehicleStore = create((set, get) => ({
    vehicles: [],
    loading: false,
    error: null,
    
    fetchVehicles: async (options = { type: 'all' }) => {
        set({ loading: true, error: null });
        try {
            const data = options.type === 'live' 
                ? await api.vehicles.getLive() 
                : await api.vehicles.getAll();
            set({ vehicles: data || [], loading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch vehicles', loading: false });
        }
    },
    
    addVehicle: (vehicle) => {
        set((state) => {
            // Prevent duplicates if REST API already gave us this vehicle
            if (state.vehicles.some(v => v.id === vehicle.id)) {
                return state;
            }
            return {
                vehicles: [vehicle, ...state.vehicles]
            };
        });
    },
    
    updateVehicle: (updatedVehicle) => {
        set((state) => ({
            vehicles: state.vehicles.map(v => 
                v.id === updatedVehicle.id ? updatedVehicle : v
            )
        }));
    },
    
    updateVehicleStatus: async (id, status) => {
        try {
            if (status === 'approved') {
                await api.vehicles.approve(id);
            } else if (status === 'rejected') {
                await api.vehicles.reject(id);
            }
            // Temporarily update UI to feel responsive
            set((state) => ({
                vehicles: state.vehicles.map(v => 
                    v.id === id ? { ...v, status } : v
                )
            }));
        } catch (error) {
            console.error(`Failed to update status to ${status}`, error);
            // Optionally, add logic to rollback or show error toast
        }
    }
}));
