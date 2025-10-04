import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

export default function EmployeesTable({ rows = [], isAdmin = false, isLoading = false, isError = false, onEdit, onDelete }) {
  const colSpan = isAdmin ? 5 : 4

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Role</TableHead>
          {isAdmin && <TableHead className="w-[160px]">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow><TableCell colSpan={colSpan}>Loading...</TableCell></TableRow>
        ) : isError ? (
          <TableRow><TableCell colSpan={colSpan} className="text-destructive">Failed to load employees</TableCell></TableRow>
        ) : rows.length === 0 ? (
          <TableRow><TableCell colSpan={colSpan}>No records</TableCell></TableRow>
        ) : (
          rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.position ?? '-'}</TableCell>
              <TableCell>{item.role}</TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(item)} className="inline-flex items-center gap-1"><Pencil size={14} /> Edit</Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(item)}
                      className="inline-flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}