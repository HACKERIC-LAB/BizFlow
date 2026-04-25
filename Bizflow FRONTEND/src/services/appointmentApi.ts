import api from './api';

export const appointmentApi = {
  list: async (params?: any) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  getAvailability: async (staffId: string, date: string) => {
    const response = await api.get(`/appointments/availability/${staffId}`, { params: { date } });
    return response.data;
  }
};
