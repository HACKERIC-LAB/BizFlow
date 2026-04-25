import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.bizflow.co.ke';

let socket: Socket | null = null;

export const getSocket = () => {
  // Disabled real socket connection for frontend-only demo
  return null;

  /*
  if (socket) return socket;
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user?.businessId) return null;

  socket = io(`${WS_URL}/queue`, {
    query: {
      token: accessToken,
      businessId: user.businessId,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
  */
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
