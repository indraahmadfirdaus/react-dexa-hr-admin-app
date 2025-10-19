import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, CalendarDays, Users, ChevronLeft, ChevronRight, Bell, FileText } from 'lucide-react'
import { useUiStore } from '../../store/ui'

function NavLink({ to, children, icon: Icon, collapsed, badgeContent }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted hover:text-muted-foreground'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span className={collapsed ? 'sr-only' : ''}>{children}</span>
      </div>
      {badgeContent ? (
        <span className={`${collapsed ? 'sr-only' : ''} ml-auto inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs px-2 min-w-[20px]`}>
          {badgeContent}
        </span>
      ) : null}
    </Link>
  )
}

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)

  // Notifications moved to header modal; no unread badge here

  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/attendance', label: 'Attendance', icon: CalendarDays },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/audit-logs', label: 'Audit Logs', icon: FileText },
  ]

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} border-r border-border bg-card text-card-foreground p-3 space-y-2`}>
      <div className={`flex items-center justify-between ${collapsed ? 'px-0' : 'px-2'}`}>
        <div className={`${collapsed ? 'sr-only' : 'text-sm font-semibold'}`}>Dexa Group</div>
        <button
          aria-label="Toggle sidebar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          onClick={toggle}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="space-y-1">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} icon={it.icon} collapsed={collapsed} badgeContent={it.badge}>
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}