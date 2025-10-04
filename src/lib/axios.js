import axios from 'axios'
import { useAuthStore } from '../store/auth'

const baseURL = import.meta.env.VITE_API_URL || '/api'
export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)