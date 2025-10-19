import React from 'react'
import { BarChart, Activity, Clock } from 'lucide-react'

export default function AuditLogsStats({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="h-12 bg-muted rounded-md mb-2"></div>
            <div className="h-6 bg-muted rounded-md w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const stats = data || { total: 0, today: 0, byEventType: [] }
  
  // Find the top event type
  const topEventType = stats.byEventType?.length > 0 
    ? stats.byEventType.reduce((prev, current) => (prev.count > current.count) ? prev : current) 
    : { eventType: 'None', count: 0 }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Logs */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
            <h3 className="text-2xl font-bold">{stats.total || 0}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <BarChart className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Today's Logs */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Logs</p>
            <h3 className="text-2xl font-bold">{stats.today || 0}</h3>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Top Event Type */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Top Event Type</p>
            <h3 className="text-lg font-bold truncate" title={topEventType.eventType?.replace(/_/g, ' ')}>
              {topEventType.eventType?.replace(/_/g, ' ') || 'None'}
            </h3>
            <p className="text-sm text-muted-foreground">{topEventType.count || 0} events</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-full">
            <Activity className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  )
}