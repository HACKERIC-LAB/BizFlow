import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  const { accessToken, user } = useAuthStore.getState();
  
  if (!accessToken || !user?.businessId) return null;

  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL + '/queue', {
      auth: { token: accessToken },
      query: { businessId: user.businessId }
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
