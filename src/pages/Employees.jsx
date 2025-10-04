import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { buildEmployeeParams, computeTotalPages } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import EmployeeCreateDialog from '@/components/employees/EmployeeCreateDialog'
import EmployeeEditDialog from '@/components/employees/EmployeeEditDialog'
import DeleteConfirmEmployeeDialog from '@/components/employees/DeleteConfirmEmployeeDialog'
import EmployeesTable from '@/components/employees/EmployeesTable'

export default function Employees() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [position, setPosition] = useState('')
  const [role, setRole] = useState('EMPLOYEE')
  const isAdmin = (useAuthStore((s) => s.user?.role) === 'ADMIN')

  // Create/Edit dialog state
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', name: '', position: '', phone: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['employees', { page, limit, search: debouncedSearch, position, role }],
    queryFn: async () => {
      const params = buildEmployeeParams({ page, limit, search: debouncedSearch, position, role })
      const res = await api.get('/employees', { params })
      return res.data
    },
    keepPreviousData: true,
  })

  const meta = data?.meta
  const rows = data?.data ?? []
  const totalPages = computeTotalPages(meta)

  const onApplyFilters = () => { setPage(1); refetch() }

  const openCreate = () => {
    setForm({ email: '', password: '', name: '', position: '', phone: '' })
    setCreateOpen(true)
  }
  const openEdit = (row) => {
    setEditing(row)
    setForm({ email: row.email ?? '', password: '', name: row.name ?? '', position: row.position ?? '', phone: row.phone ?? '' })
    setEditOpen(true)
  }
  const closeCreate = () => setCreateOpen(false)
  const closeEdit = () => { setEditOpen(false); setEditing(null) }
  const openDelete = (row) => { setToDelete(row); setDeleteOpen(true) }
  const closeDelete = () => { setDeleteOpen(false); setToDelete(null) }

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/employees', payload)
      return res.data
    },
    onSuccess: () => {
      toast.success('Employee created')
      setCreateOpen(false)
      refetch()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Failed to create employee'
      toast.error(String(msg))
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.patch(`/employees/${id}`, payload)
      return res.data
    },
    onSuccess: () => {
      toast.success('Employee updated')
      closeEdit()
      refetch()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Failed to update employee'
      toast.error(String(msg))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/employees/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Employee deleted')
      closeDelete()
      refetch()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Failed to delete employee'
      toast.error(String(msg))
    }
  })

  const submitCreate = (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.name || !form.position) {
      toast.error('Email, password, name, and position are required')
      return
    }
    createMutation.mutate({
      email: form.email,
      password: form.password,
      name: form.name,
      position: form.position,
      phone: form.phone || undefined,
    })
  }

  const submitEdit = (e) => {
    e.preventDefault()
    if (!editing?.id) return
    const payload = {
      email: form.email || undefined,
      name: form.name || undefined,
      position: form.position || undefined,
      phone: form.phone || undefined,
    }
    updateMutation.mutate({ id: editing.id, payload })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Employees</h2>
      <p className="text-sm text-muted-foreground">Manage employee profiles and details.</p>

      {isAdmin && (
        <div className="flex items-center justify-between">
          <Button onClick={openCreate} className="inline-flex items-center gap-2"><Plus size={16} /> Add Employee</Button>
        </div>
      )}

      <div className="rounded-lg border border-border p-4 bg-card text-card-foreground">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label className="mb-1 block">Search</Label>
            <Input type="text" placeholder="Name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Position</Label>
            <Input type="text" placeholder="e.g. Frontend Developer" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={onApplyFilters}>Apply</Button>
            <Button variant="outline" onClick={() => { setSearch(''); setPosition(''); setRole(''); setPage(1); refetch() }}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-auto">
          <EmployeesTable
            rows={rows}
            isAdmin={isAdmin}
            isLoading={isLoading}
            isError={isError}
            onEdit={openEdit}
            onDelete={openDelete}
          />
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

      {/* Create Dialog */}
      <EmployeeCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={form}
        setForm={setForm}
        onSubmit={submitCreate}
        onCancel={closeCreate}
        isLoading={createMutation.isLoading}
      />

      {/* Edit Dialog */}
      <EmployeeEditDialog
        open={editOpen}
        onOpenChange={(v) => (v ? setEditOpen(true) : closeEdit())}
        form={form}
        setForm={setForm}
        onSubmit={submitEdit}
        onCancel={closeEdit}
        isLoading={updateMutation.isLoading}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmEmployeeDialog
        open={deleteOpen}
        onOpenChange={(v) => (v ? setDeleteOpen(true) : closeDelete())}
        employee={toDelete}
        onCancel={closeDelete}
        onConfirm={() => deleteMutation.mutate(toDelete?.id)}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  )
}