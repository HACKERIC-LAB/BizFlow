import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StaffRole = 'MANAGER' | 'STAFF';

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
  status: 'Active' | 'Offline';
  schedule?: StaffSchedule[];
}

interface StaffState {
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  removeStaff: (id: string) => void;
}

export const useStaffStore = create<StaffState>()(
  persist(
    (set) => ({
      staff: [
        { id: '1', name: 'Alice Wambui', role: 'MANAGER', phone: '0712345678', status: 'Active' },
        { id: '2', name: 'David Maina', role: 'STAFF', phone: '0722334455', status: 'Active' },
        { id: '3', name: 'Sarah Atieno', role: 'STAFF', phone: '0733445566', status: 'Offline' },
      ],
      addStaff: (member) => set((state) => ({
        staff: [...state.staff, { ...member, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateStaff: (id, updates) => set((state) => ({
        staff: state.staff.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      removeStaff: (id) => set((state) => ({
        staff: state.staff.filter((s) => s.id !== id)
      })),
    }),
    {
      name: 'bizflow-staff',
    }
  )
);
