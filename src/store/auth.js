import { create } from 'zustand'

const initialToken = (() => {
  try {
    return localStorage.getItem('auth_token') || null
  } catch {
    return null
  }
})()

const initialUser = (() => {
  try {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

export const useAuthStore = create((set, get) => ({
  token: initialToken,
  user: initialUser,
  setToken: (token) => {
    set({ token })
    try {
      if (token) localStorage.setItem('auth_token', token)
      else localStorage.removeItem('auth_token')
    } catch {}
  },
  setUser: (user) => {
    set({ user })
    try {
      if (user) localStorage.setItem('auth_user', JSON.stringify(user))
      else localStorage.removeItem('auth_user')
    } catch {}
  },
  logout: () => {
    set({ token: null, user: null })
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    } catch {}
  },
}))