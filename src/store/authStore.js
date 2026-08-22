import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/axios.js';
import { connectSocket, disconnectSocket } from '../lib/socket.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Token muddati o'tmaganini tekshiradi
      isAuthenticated: () => {
        const { token } = get();
        if (!token) return false;
        try {
          const { exp } = jwtDecode(token);
          return exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },

      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', formData);
          const { token, ...user } = data;
          set({ user, token, isLoading: false });
          connectSocket(user._id);
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || "Ro'yxatdan o'tishda xatolik";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      login: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', formData);
          const { token, ...user } = data;
          set({ user, token, isLoading: false });
          connectSocket(user._id);
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Kirishda xatolik';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),

      logout: () => {
        disconnectSocket();
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage kaliti
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
