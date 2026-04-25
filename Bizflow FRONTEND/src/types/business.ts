export type BusinessType = 'BARBERSHOP' | 'SALON' | 'GYM' | 'SPA' | 'OTHER';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  phone: string;
  operatingHours: Record<string, { start: string; end: string }>;
  logoUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  requiresDeposit: boolean;
}
