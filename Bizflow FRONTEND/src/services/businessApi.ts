import api from './api';

export const businessApi = {
  getCurrent: async () => {
    const response = await api.get('/business/current');
    return response.data;
  },
  updateCurrent: async (data: any) => {
    const response = await api.put('/business/current', data);
    return response.data;
  },
  getServices: async () => {
    const response = await api.get('/business/services');
    return response.data;
  },
  updateServices: async (services: any[]) => {
    const response = await api.post('/business/services', { services });
    return response.data;
  }
};
