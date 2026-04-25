import api from './api';

export const customerApi = {
  list: async (params?: any) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  }
};
