import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { computeTotalPages } from '@/lib/query'
import { useNotificationStore } from '@/store/notifications'

export default function NotificationsModal({ open, onOpenChange }) {
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount)

  const [page, setPage] = useState(1)
  const limit = 10

  const listQuery = useQuery({
    queryKey: ['notificationsModalList', page, limit],
    queryFn: async () => {
      const res = await api.get('/notifications', { params: { page, limit } })
      return res.data
    },
    enabled: open,
    keepPreviousData: true,
  })

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-as-read')
      fetchUnreadCount()
      listQuery.refetch()
    } catch (_) {}
  }

  const markOneAsRead = async (id) => {
    if (!id) return
    try {
      await api.post('/notifications/mark-as-read', { notificationIds: [id] })
      fetchUnreadCount()
      listQuery.refetch()
    } catch (_) {}
  }

  const close = () => onOpenChange?.(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 py-3 rounded-t-lg">
          <DialogTitle className="m-0">Notifications</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark All as Read</Button>
            <button
              type="button"
              aria-label="Close"
              title="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              onClick={close}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="px-4 py-3 max-h-[70vh] overflow-y-auto">
          <div className="text-sm text-muted-foreground mb-2">Unread: <span className="font-medium">{unreadCount}</span></div>
          {listQuery.isLoading ? (
            <div className="p-2">Loading...</div>
          ) : listQuery.isError ? (
            <div className="p-2 text-destructive">Failed to load notifications</div>
          ) : (Array.isArray(listQuery.data?.data) && listQuery.data.data.length > 0) ? (
            <div className="space-y-2">
              {listQuery.data.data.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-md border p-3 ${n.isRead ? 'border-border' : 'border-blue-600'} bg-card`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">{n.message}</div>
                    </div>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${n.isRead ? 'border-border text-muted-foreground' : 'border-blue-600 text-blue-700 dark:text-blue-500'}`}>
                      {n.isRead ? 'READ' : 'UNREAD'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {!n.isRead && (
                      <Button size="sm" variant="outline" onClick={() => markOneAsRead(n.id)}>Mark as Read</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">No notifications</div>
          )}
        </div>
        <div className="border-t border-border bg-card/95 backdrop-blur px-4 py-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Rows per page: <span className="font-medium">{limit}</span>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const totalPages = computeTotalPages(listQuery.data?.meta)
              const canPrev = page > 1
              const canNext = page < totalPages
              return (
                <>
                  <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button size="sm" variant="outline" onClick={() => setPage(1)} disabled={!canPrev}>First</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={!canPrev}>Prev</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={!canNext}>Next</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(totalPages)} disabled={!canNext}>Last</Button>
                </>
              )
            })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}