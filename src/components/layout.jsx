import React, { useEffect, useState } from 'react'
import Sidebar from './ui/sidebar'
import ThemeToggle from './theme-toggle'
import { useNotificationStore } from '../store/notifications'
import { Button } from './ui/button'
import useNotificationsWs from '../hooks/useNotificationsWs'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { Avatar } from './ui/avatar'
import { LogOut, Bell } from 'lucide-react'
import NotificationsModal from './notifications/NotificationsModal'

export default function Layout({ children }) {
  const userId = useNotificationStore((s) => s.userId)
  const setUserId = useNotificationStore((s) => s.setUserId)
  const clearNotifications = useNotificationStore((s) => s.clear)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount)
  const { disconnect } = useNotificationsWs()
  const logout = useAuthStore((s) => s.logout)
  const authUser = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    const uid = authUser?.id || ''
    setUserId(uid)
  }, [authUser, setUserId])
  useEffect(() => { fetchUnreadCount() }, [fetchUnreadCount])

  const [notifOpen, setNotifOpen] = useState(false)
  const openNotif = () => setNotifOpen(true)

  const onLogout = () => {
    logout()
    disconnect()
    clearNotifications()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Dexa HR Admin Dashboard</h1>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Open notifications"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              onClick={openNotif}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] px-1 min-w-[16px]">
                  {Math.min(unreadCount, 99)}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <span className="text-sm font-semibold">Hi, {useAuthStore.getState().user?.name || 'Admin'}</span>
              <Avatar name={useAuthStore.getState().user?.name} email={useAuthStore.getState().user?.email} />
            </div>
            <Button variant="destructive" size="icon" onClick={onLogout} aria-label="Logout" title="Logout">
              <LogOut size={16} />
            </Button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
      <NotificationsModal open={notifOpen} onOpenChange={setNotifOpen} />
    </div>
  )
}