import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuditLogs, getAuditStats } from '@/lib/api/audit-logs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import AuditLogsTable from '@/components/audit-logs/AuditLogsTable'
import AuditLogsStats from '@/components/audit-logs/AuditLogsStats'
import { format, startOfDay, endOfDay } from 'date-fns'

const EVENT_TYPES = [
  { value: '', label: 'All Events' },
  { value: 'PROFILE_UPDATE', label: 'Profile Update' },
  { value: 'PASSWORD_CHANGE', label: 'Password Change' },
  { value: 'PHOTO_UPDATE', label: 'Photo Update' },
  { value: 'PHONE_UPDATE', label: 'Phone Update' },
  { value: 'ATTENDANCE_CLOCK_IN', label: 'Clock In' },
  { value: 'ATTENDANCE_CLOCK_OUT', label: 'Clock Out' },
  { value: 'EMPLOYEE_CREATED', label: 'Employee Created' },
  { value: 'EMPLOYEE_UPDATED', label: 'Employee Updated' },
  { value: 'EMPLOYEE_DELETED', label: 'Employee Deleted' },
]

export default function AuditLogs() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [userId, setUserId] = useState('')
  const [eventType, setEventType] = useState('')
  const [startDate, setStartDate] = useState(format(startOfDay(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfDay(new Date()), 'yyyy-MM-dd'))

  // Fetch audit logs with filters
  const { 
    data: logsData, 
    isLoading: logsLoading, 
    isError: logsError, 
    refetch: refetchLogs 
  } = useQuery({
    queryKey: ['auditLogs', { page, limit, userId, eventType, startDate, endDate }],
    queryFn: async () => {
      const params = { page, limit }
      if (userId) params.userId = userId
      if (eventType) params.eventType = eventType
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      return getAuditLogs(params)
    },
    keepPreviousData: true,
  })

  // Fetch audit stats
  const { 
    data: statsData, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['auditStats', { userId }],
    queryFn: async () => {
      const response = await getAuditStats({ userId })
      return response.data // Extract the data from the response
    },
  })

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    refetchLogs()
  }

  const handleReset = () => {
    setUserId('')
    setEventType('')
    setStartDate('')
    setEndDate('')
    setPage(1)
    refetchLogs()
  }

  const rows = logsData?.data || []
  const meta = logsData?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            View and analyze system activity logs
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <AuditLogsStats data={statsData} isLoading={statsLoading} />

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-auto">
              <Label htmlFor="userId" className="text-xs">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Filter by user ID"
                className="h-9 w-[180px]"
              />
            </div>
            
            <div className="w-auto">
              <Label htmlFor="eventType" className="text-xs">Event Type</Label>
              <Select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="h-9 w-[150px]"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="w-auto">
              <Label htmlFor="startDate" className="text-xs">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            
            <div className="w-auto">
              <Label htmlFor="endDate" className="text-xs">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="h-9">Apply</Button>
              <Button type="button" variant="outline" size="sm" className="h-9" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Table */}
      <AuditLogsTable
        data={rows}
        isLoading={logsLoading}
        isError={logsError}
        page={page}
        limit={limit}
        totalPages={meta.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}