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
  status: 'ACTIVE' | 'INACTIVE';
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
      set({ staff: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  deactivateStaff: async (id: string) => {
    await staffApi.deactivate(id);
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id)
    }));
  }
}));
