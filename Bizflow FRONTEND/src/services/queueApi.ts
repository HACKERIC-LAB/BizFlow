import api from './api';

export const queueApi = {
  getActive: async () => {
    const response = await api.get('/queue/active');
    return response.data;
  },
  checkIn: async (data: any) => {
    const response = await api.post('/queue/checkin', data);
    return response.data;
  },
  startServing: async (id: string) => {
    const response = await api.put(`/queue/${id}/start-serving`);
    return response.data;
  },
  complete: async (id: string) => {
    const response = await api.put(`/queue/${id}/complete`);
    return response.data;
  },
  skip: async (id: string) => {
    const response = await api.put(`/queue/${id}/skip`);
    return response.data;
  },
  getPosition: async (phone: string) => {
    const response = await api.get(`/queue/position/${phone}`);
    return response.data;
  }
};
