import api from './api';

export const staffApi = {
  list: async () => {
    const response = await api.get('/staff');
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/staff', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  },
  getReport: async (id: string, month?: string) => {
    const response = await api.get(`/staff/${id}/report`, { params: { month } });
    return response.data;
  },
  deactivate: async (id: string) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },
  resetPassword: async (id: string) => {
    const response = await api.post(`/staff/${id}/reset-password`);
    return response.data;
  },
  updateSchedule: async (id: string, schedule: any) => {
    const response = await api.put(`/staff/${id}/schedule`, { schedule });
    return response.data;
  }
};
