import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNotificationStore } from '../store/notificationStore.js';
import { useChatStore } from '../store/chatStore.js';
import { connectSocket, getSocket } from '../lib/socket.js';

// App.jsx ichida bir marta chaqiriladi. Login qilingan foydalanuvchi uchun
// socket ulanishini ochadi va real-time eventlarni tegishli store'larga uzatadi.
export const useSocketEvents = () => {
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const receiveMessage = useChatStore((s) => s.receiveMessage);
  const setOnlineUsers = useChatStore((s) => s.setOnlineUsers);

  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket(user._id) || getSocket();
    if (!socket) return;

    socket.on('newNotification', addNotification);
    socket.on('newMessage', receiveMessage);
    socket.on('getOnlineUsers', setOnlineUsers);

    return () => {
      socket.off('newNotification', addNotification);
      socket.off('newMessage', receiveMessage);
      socket.off('getOnlineUsers', setOnlineUsers);
    };
  }, [user?._id, addNotification, receiveMessage, setOnlineUsers]);
};
