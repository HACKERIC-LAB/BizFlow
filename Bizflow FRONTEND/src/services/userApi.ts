import api from './api';

export const userApi = {
  getMe: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  updateMe: async (data: { name: string; email?: string; profilePhoto?: string }) => {
    const response = await api.patch('/user/me', data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await api.patch('/user/change-password', data);
    return response.data;
  },
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/user/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
