import api from './api';

export const reportsApi = {
  getMonthlyComparison: async (months: { year: number; month: number }[]) => {
    const response = await api.post('/reports/monthly-comparison', { months });
    return response.data;
  }
};
