import type { BusinessType } from '../types/business';

export interface BusinessContent {
  serviceLabel: string;
  customersLabel: string;
  staffLabel: string;
  defaultServices: string[];
}

const BUSINESS_CONTENT: Record<BusinessType, BusinessContent> = {
  BARBERSHOP: {
    serviceLabel: 'Service',
    customersLabel: 'Clients',
    staffLabel: 'Barbers',
    defaultServices: ['Haircut', 'Shave', 'Beard Trim'],
  },
  SALON: {
    serviceLabel: 'Service',
    customersLabel: 'Clients',
    staffLabel: 'Stylists',
    defaultServices: ['Hair Styling', 'Braiding', 'Manicure'],
  },
  GYM: {
    serviceLabel: 'Session',
    customersLabel: 'Members',
    staffLabel: 'Trainers',
    defaultServices: ['Personal Training', 'Yoga Class', 'Day Pass'],
  },
  SPA: {
    serviceLabel: 'Treatment',
    customersLabel: 'Guests',
    staffLabel: 'Therapists',
    defaultServices: ['Massage', 'Facial', 'Body Scrub'],
  },
  OTHER: {
    serviceLabel: 'Service',
    customersLabel: 'Customers',
    staffLabel: 'Staff',
    defaultServices: ['Standard Service'],
  },
};

export const getBusinessContent = (type: BusinessType = 'BARBERSHOP'): BusinessContent => {
  return BUSINESS_CONTENT[type] || BUSINESS_CONTENT.BARBERSHOP;
};
