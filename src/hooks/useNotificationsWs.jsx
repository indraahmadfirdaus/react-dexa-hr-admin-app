import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotificationStore } from '../store/notifications'

// Ensure we connect to the notifications namespace even if env omits it
const WS_BASE = import.meta.env.VITE_WS_URL || 'wss://api.otter-server.win'
const WS_URL = WS_BASE.replace(/\/$/, '').endsWith('/notifications')
  ? WS_BASE
  : `${WS_BASE.replace(/\/$/, '')}/notifications`

export default function useNotificationsWs() {
  // Select primitives/functions individually to avoid returning a new object each render
  const userId = useNotificationStore((s) => s.userId)
  const setLastPayload = useNotificationStore((s) => s.setLastPayload)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const socketRef = useRef(null)
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount)
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount)

  const disconnect = useCallback(() => {
    const sock = socketRef.current
    if (sock) {
      sock.off('notification')
      sock.off('unreadCount')
      sock.disconnect()
      socketRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!userId) {
      toast.error('Admin ID is required to connect')
      return
    }
    if (socketRef.current) return

    const socket = io(WS_URL, {
      auth: { userId },
      transports: ['websocket'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[WS] connected', { socketId: socket.id, userId })
    })

    // Remove connect/disconnect toasts per request

    socket.on('notification', (data) => {
      const payload = data?.data ?? data
      setLastPayload(payload)
      addNotification({ receivedAt: Date.now(), payload })
      
      const title = typeof payload === 'object' ? payload?.title || 'Notification' : 'Notification'
      const body = typeof payload === 'object' ? payload?.message || JSON.stringify(payload) : String(payload)

      const type = typeof payload === 'object' ? payload?.type : undefined
      const iconMap = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertTriangle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        default: <Bell className="w-5 h-5" />,
      }

      if (type === 'success') {
        toast.success(title, { description: body, icon: iconMap.success })
      } else if (type === 'error') {
        toast.error(title, { description: body, icon: iconMap.error })
      } else if (type === 'warning') {
        toast.warning(title, { description: body, icon: iconMap.warning })
      } else if (type === 'info') {
        toast.info(title, { description: body, icon: iconMap.info })
      } else {
        toast(title, { description: body, icon: iconMap.default })
      }

      // Update unread count via store by fetching latest value
      fetchUnreadCount()
    })

    // Update unread count when server sends it
    socket.on('unreadCount', (data) => {
      const count = data?.count ?? data
      setUnreadCount(count)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error', err)
      toast.error('Socket connection error')
    })

    socket.on('disconnect', (reason) => {
      console.log('[WS] disconnected', { reason })
    })
  }, [userId, setLastPayload, addNotification, fetchUnreadCount, setUnreadCount])

  useEffect(() => {
    // Auto connect when userId is available; disconnect when it becomes empty
    if (userId && !socketRef.current) {
      connect()
    } else if (!userId && socketRef.current) {
      disconnect()
    }
    return () => disconnect()
  }, [userId])

  return { connect, disconnect }
}