import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { formatDateTime } from '@/lib/query'

export default function AttendanceTable({ rows = [], isLoading = false, isError = false }) {
  const colSpan = 6

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Clock In</TableHead>
          <TableHead>Clock Out</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow><TableCell colSpan={colSpan}>Loading...</TableCell></TableRow>
        ) : isError ? (
          <TableRow><TableCell colSpan={colSpan} className="text-destructive">Failed to load attendance</TableCell></TableRow>
        ) : rows.length === 0 ? (
          <TableRow><TableCell colSpan={colSpan}>No records</TableCell></TableRow>
        ) : (
          rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.user?.name ?? '-'}</div>
                <div className="text-xs text-muted-foreground">{item.user?.email ?? '-'}</div>
              </TableCell>
              <TableCell>{formatDateTime(item.date)}</TableCell>
              <TableCell>{formatDateTime(item.clockIn)}</TableCell>
              <TableCell>{item.clockOut ? formatDateTime(item.clockOut) : '-'}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                    item.status === 'PRESENT'
                      ? 'border-green-600 text-green-700 dark:text-green-500'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {item.status ?? '-'}
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}