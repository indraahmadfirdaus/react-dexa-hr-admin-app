import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteConfirmEmployeeDialog({ open, onOpenChange, employee, onCancel, onConfirm, isLoading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm overflow-hidden">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
        </DialogHeader>
        <div className="px-4 py-2 text-sm">
          <p>Are you sure you want to delete this employee?</p>
          <div className="mt-2 rounded-md border p-2 bg-muted">
            <div className="font-medium">{employee?.name ?? '-'}</div>
            <div className="text-xs text-muted-foreground">{employee?.email ?? '-'}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}