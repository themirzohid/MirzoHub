import { io } from 'socket.io-client';

let socket = null;

// Login qilingandan keyin chaqiriladi - bitta umumiy socket ulanishi yaratadi
export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    query: { userId },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
