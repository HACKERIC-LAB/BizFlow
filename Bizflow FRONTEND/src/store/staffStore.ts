import { create } from 'zustand';
import { staffApi } from '../services/staffApi';

export type StaffRole = 'MANAGER' | 'STAFF' | 'OWNER' | 'VIEWER';

export interface StaffSchedule {
  day: string;
  off: boolean;
  shifts: { start: string; end: string }[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email?: string;
  isActive: boolean;
  commission: number;
  status?: 'ACTIVE' | 'INACTIVE'; // Derived for UI
  schedule?: StaffSchedule[];
}

interface StaffState {
  staff: StaffMember[];
  isLoading: boolean;
  fetchStaff: () => Promise<void>;
  deactivateStaff: (id: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  isLoading: false,
  fetchStaff: async () => {
    set({ isLoading: true });
    try {
      const response = await staffApi.list();
      // Map isActive to status for UI consistency
      const mappedStaff = response.data.map((s: any) => ({
        ...s,
        status: s.isActive ? 'ACTIVE' : 'INACTIVE'
      }));
      set({ staff: mappedStaff, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  deactivateStaff: async (id: string) => {
    await staffApi.deactivate(id);
    set((state) => ({
      staff: state.staff.map((s) => 
        s.id === id ? { ...s, isActive: false, status: 'INACTIVE' as const } : s
      )
    }));
  }
}));
