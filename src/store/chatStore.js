import { create } from 'zustand';
import api from '../lib/axios.js';

export const useChatStore = create((set, get) => ({
  messages: [],
  conversations: [],
  onlineUserIds: [],
  activeConversationUserId: null,

  setActiveConversation: (userId) => set({ activeConversationUserId: userId, messages: [] }),

  fetchConversations: async () => {
    const { data } = await api.get('/messages');
    set({ conversations: data });
  },

  fetchConversation: async (userId) => {
    const { data } = await api.get(`/messages/${userId}`);
    set({ messages: data });
  },

  sendMessage: async (receiverId, text) => {
    const { data } = await api.post('/messages', { receiverId, text });
    set((state) => ({ messages: [...state.messages, data] }));
    return data;
  },

  // socket.io "newMessage" eventi orqali kirib kelgan xabar
  receiveMessage: (message) =>
    set((state) => {
      const isActiveChat =
        state.activeConversationUserId &&
        (message.sender === state.activeConversationUserId ||
          message.sender?._id === state.activeConversationUserId);

      if (!isActiveChat) return state; // boshqa suhbatga tegishli - shu yerda saqlamaymiz
      return { messages: [...state.messages, message] };
    }),

  setOnlineUsers: (ids) => set({ onlineUserIds: ids }),
}));
