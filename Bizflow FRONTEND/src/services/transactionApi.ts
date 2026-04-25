import api from './api';

export const transactionApi = {
  recordCash: async (data: any) => {
    const response = await api.post('/transactions/cash', data);
    return response.data;
  },
  initiateMpesa: async (data: any) => {
    const response = await api.post('/transactions/mpesa/stk', data);
    return response.data;
  },
  list: async (params: any) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  getDailySummary: async () => {
    const response = await api.get('/transactions/daily-summary');
    return response.data;
  }
};
