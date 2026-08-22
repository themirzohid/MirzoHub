import { create } from 'zustand';
import api from '../lib/axios.js';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const { data } = await api.get('/notifications');
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.isRead).length,
      });
    } catch (err) {
      console.error("Bildirishnomalarni olishda xatolik:", err.message);
    }
  },

  // socket.io orqali "newNotification" eventi kelganda chaqiriladi
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: async (id) => {
    await api.put(`/notifications/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all');
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  reset: () => set({ notifications: [], unreadCount: 0 }),
}));
