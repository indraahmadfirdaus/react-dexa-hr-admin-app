import { create } from 'zustand'
import { api } from '@/lib/axios'

export const useNotificationStore = create((set, get) => ({
  userId: '',
  setUserId: (id) => set({ userId: id }),
  lastPayload: null,
  items: [],
  addNotification: (item) => set((state) => ({ items: [item, ...state.items] })),
  setLastPayload: (payload) => set({ lastPayload: payload }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: Number(count) || 0 }),
  fetchUnreadCount: async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      const count = res?.data?.data?.count ?? res?.data?.count ?? 0
      set({ unreadCount: Number(count) || 0 })
    } catch (_) {
    }
  },
  clear: () => set({ items: [], lastPayload: null, unreadCount: 0 }),
}))