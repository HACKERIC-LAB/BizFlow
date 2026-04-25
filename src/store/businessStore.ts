import { create } from 'zustand';
import type { Business, Service } from '../types/business';
import type { User } from '../types/user';

interface BusinessState {
  currentBusiness: Business | null;
  services: Service[];
  staffList: User[];
  setBusiness: (business: Business) => void;
  setServices: (services: Service[]) => void;
  setStaff: (staff: User[]) => void;
  addService: (service: Service) => void;
  addStaff: (staff: User) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  currentBusiness: null,
  services: [],
  staffList: [],
  setBusiness: (business) => set({ currentBusiness: business }),
  setServices: (services) => set({ services }),
  setStaff: (staff) => set({ staffList: staff }),
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  addStaff: (staff) => set((state) => ({ staffList: [...state.staffList, staff] })),
}));
