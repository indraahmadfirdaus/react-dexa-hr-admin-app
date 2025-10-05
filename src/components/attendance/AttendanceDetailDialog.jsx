import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/query'
import { MapPin } from 'lucide-react'

export default function AttendanceDetailDialog({ open, onOpenChange, attendance }) {
  const a = attendance || {}
  const user = a.user || {}

  const mapsLink = (lat, lng) =>
    lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
        </DialogHeader>
        <div className="px-4 py-3 space-y-4 text-sm">
          {/* Employee */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Employee</div>
              <div className="font-medium">{user.name ?? '-'}</div>
              <div className="text-xs text-muted-foreground">{user.email ?? '-'}</div>
              {user.position && (
                <div className="text-xs text-muted-foreground">{user.position}</div>
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border mt-1">
                {a.status ?? '-'}
              </span>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium">{a.date ? formatDateTime(a.date) : '-'}</div>
              </div>
            </div>
          </div>

          {/* Clock In */}
          <div className="rounded-lg border border-border p-3 bg-card text-card-foreground">
            <div className="text-sm font-medium">Clock In</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="font-medium">{a.clockIn ? formatDateTime(a.clockIn) : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Coordinates</div>
                <div className="font-medium">
                  {a.clockInLatitude != null && a.clockInLongitude != null
                    ? `${a.clockInLatitude}, ${a.clockInLongitude}`
                    : '-'}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Address</div>
                <div className="font-medium">{a.clockInAddress ?? '-'}</div>
                {mapsLink(a.clockInLatitude, a.clockInLongitude) && (
                  <a
                    href={mapsLink(a.clockInLatitude, a.clockInLongitude)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <MapPin size={14} /> Open in Maps
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Clock Out */}
          <div className="rounded-lg border border-border p-3 bg-card text-card-foreground">
            <div className="text-sm font-medium">Clock Out</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="font-medium">{a.clockOut ? formatDateTime(a.clockOut) : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Coordinates</div>
                <div className="font-medium">
                  {a.clockOutLatitude != null && a.clockOutLongitude != null
                    ? `${a.clockOutLatitude}, ${a.clockOutLongitude}`
                    : '-'}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Address</div>
                <div className="font-medium">{a.clockOutAddress ?? '-'}</div>
                {mapsLink(a.clockOutLatitude, a.clockOutLongitude) && (
                  <a
                    href={mapsLink(a.clockOutLatitude, a.clockOutLongitude)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <MapPin size={14} /> Open in Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}