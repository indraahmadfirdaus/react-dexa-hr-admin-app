import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { buildAttendanceParams, computeTotalPages, formatDateTime } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import AttendanceTable from '@/components/attendance/AttendanceTable'

export default function Attendance() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['attendance', { page, limit, startDate, endDate }],
    queryFn: async () => {
      const params = buildAttendanceParams({ page, limit, startDate, endDate })
      const res = await api.get('/attendance/all', { params })
      return res.data
    },
    keepPreviousData: true,
  })

  const meta = data?.meta
  const rows = data?.data ?? []
  const totalPages = computeTotalPages(meta)

  const onApplyFilters = () => {
    setPage(1)
    refetch()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Attendance</h2>
      <p className="text-sm text-muted-foreground">View and track employee attendance records.</p>

      <div className="rounded-lg border border-border p-4 bg-card text-card-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1 block">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
              onFocus={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
            />
          </div>
          <div>
            <Label className="mb-1 block">End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
              onFocus={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={onApplyFilters}>Apply</Button>
            <Button variant="outline" onClick={() => { setStartDate(''); setEndDate(''); setPage(1); refetch() }}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-auto">
          <AttendanceTable rows={rows} isLoading={isLoading} isError={isError} />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs">Rows per page</span>
            <Select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}>
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
            <span className="text-xs text-muted-foreground">Total {meta?.total ?? rows.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Page {meta?.page ?? page} of {totalPages}</span>
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}