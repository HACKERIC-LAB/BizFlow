export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'VIEWER';

export interface WorkingHour {
  day: number; // 0-6 (Sunday-Saturday)
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  businessId: string;
  businessName: string;
  commission?: number;
  workingHours?: WorkingHour[];
}
