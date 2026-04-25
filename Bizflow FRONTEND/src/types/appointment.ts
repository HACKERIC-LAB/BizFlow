export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string; // ISO string
  status: AppointmentStatus;
}
