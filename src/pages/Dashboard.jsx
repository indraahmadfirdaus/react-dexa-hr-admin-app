import React from 'react'
import { Users, CalendarDays, Bell } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold mb-1">Admin Operational Guide</h2>
        <p className="text-sm text-muted-foreground">Simple steps for the main features.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4 bg-card text-card-foreground flex items-start gap-3">
          <Users className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-medium">Employees</h3>
            <p className="text-sm text-muted-foreground">
              - Search employees by name, position, or department.
              <br />
              - Use filters or paging to navigate the list easily.
              <br />
              - Click an employee row to view more details.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 bg-card text-card-foreground flex items-start gap-3">
          <CalendarDays className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-medium">Attendances</h3>
            <p className="text-sm text-muted-foreground">
              - Select a date range to view attendance history.
              <br />
              - Use paging to navigate long lists.
              <br />
              - Check presence status, check-in, and check-out.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 bg-card text-card-foreground flex items-start gap-3 md:col-span-2">
          <Bell className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-medium">Realtime Notifications</h3>
            <p className="text-sm text-muted-foreground">
              - Connects automatically after login; no button needed.
              <br />
              - Notifications appear when important information is available.
              <br />
              - On logout, the notification connection stops automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}