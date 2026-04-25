import api from './api';

export const aiApi = {
  chat: async (message: string) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },
  getRevenueInsights: async () => {
    const response = await api.get('/ai/revenue-insights');
    return response.data;
  },
  getStaffPerformance: async () => {
    const response = await api.get('/ai/staff-performance');
    return response.data;
  }
};
