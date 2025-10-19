import React from 'react'
import { format } from 'date-fns'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function AuditLogDetailDialog({ open, onOpenChange, auditLog }) {
  if (!auditLog) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss')
    } catch (e) {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Audit Log Details</h2>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* User Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">User</h3>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Name:</span>
                      <div className="font-medium">{auditLog.userName || 'Unknown'}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">ID:</span>
                      <div className="font-medium">{auditLog.userId || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Event</h3>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Type:</span>
                      <div className="font-medium">{auditLog.eventType?.replace(/_/g, ' ') || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Action:</span>
                      <div className="font-medium">{auditLog.eventAction || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">IP Address:</span>
                      <div className="font-medium">{auditLog.ipAddress || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">User Agent:</span>
                      <div className="font-medium text-xs truncate" title={auditLog.userAgent}>
                        {auditLog.userAgent || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Changes */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Data Changes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Old Data */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium">Previous Data</h4>
                    <div className="bg-muted/50 p-3 rounded-md h-48 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {auditLog.oldData ? JSON.stringify(auditLog.oldData, null, 2) : 'No previous data'}
                      </pre>
                    </div>
                  </div>

                  {/* New Data */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium">New Data</h4>
                    <div className="bg-muted/50 p-3 rounded-md h-48 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {auditLog.newData ? JSON.stringify(auditLog.newData, null, 2) : 'No new data'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Timestamps</h3>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Created:</span>
                      <div className="font-medium">{formatDate(auditLog.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Updated:</span>
                      <div className="font-medium">{formatDate(auditLog.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}