import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export default function Protected({ children }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}