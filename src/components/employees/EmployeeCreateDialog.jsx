import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function EmployeeCreateDialog({ open, onOpenChange, form, setForm, onSubmit, onCancel, isLoading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3 px-4 py-2">
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <Label className="mb-1 block">Password</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          </div>
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <Label className="mb-1 block">Position</Label>
            <Input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} required />
          </div>
          <div>
            <Label className="mb-1 block">Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving…' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}