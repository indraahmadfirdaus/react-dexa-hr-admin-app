import React, { useState } from 'react'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import AuditLogDetailDialog from './AuditLogDetailDialog'

export default function AuditLogsTable({ 
  data = [], 
  isLoading, 
  isError, 
  page = 1, 
  limit = 10, 
  totalPages = 1, 
  onPageChange 
}) {
  const [selectedLog, setSelectedLog] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleViewDetails = (log) => {
    setSelectedLog(log)
    setDetailOpen(true)
  }

  const renderEventTypeBadge = (eventType) => {
    const badgeClasses = {
      PROFILE_UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      PASSWORD_CHANGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      PHOTO_UPDATE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      PHONE_UPDATE: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
      ATTENDANCE_CLOCK_IN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      ATTENDANCE_CLOCK_OUT: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      EMPLOYEE_CREATED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      EMPLOYEE_UPDATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      EMPLOYEE_DELETED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }

    const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
    const colorClass = badgeClasses[eventType] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

    return (
      <span className={`${baseClass} ${colorClass}`}>
        {eventType?.replace(/_/g, ' ')}
      </span>
    )
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading audit logs...</div>
  }

  if (isError) {
    return <div className="text-center py-4 text-red-500">Error loading audit logs</div>
  }

  if (data.length === 0) {
    return <div className="text-center py-4">No audit logs found</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="w-[100px] p-2 text-left text-xs font-medium">Date</th>
              <th className="p-2 text-left text-xs font-medium">User</th>
              <th className="p-2 text-left text-xs font-medium">Event Type</th>
              <th className="p-2 text-left text-xs font-medium">Action</th>
              <th className="p-2 text-left text-xs font-medium">IP Address</th>
              <th className="w-[100px] p-2 text-center text-xs font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log) => (
              <tr key={log.id} className="border-t hover:bg-muted/50">
                <td className="p-2 text-sm">
                  {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy HH:mm') : 'N/A'}
                </td>
                <td className="p-2 text-sm">
                  <div className="font-medium">{log.userName || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">{log.userId}</div>
                </td>
                <td className="p-2 text-sm">
                  {renderEventTypeBadge(log.eventType)}
                </td>
                <td className="p-2 text-sm">
                  {log.eventAction}
                </td>
                <td className="p-2 text-sm">
                  {log.ipAddress}
                </td>
                <td className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(log)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Detail Dialog */}
      <AuditLogDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        auditLog={selectedLog}
      />
    </>
  )
}