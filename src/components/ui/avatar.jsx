import React from 'react'
import { cn } from '@/lib/utils'

function getInitials(name, email) {
  const source = name || email || 'Admin'
  const parts = String(source).trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (source.includes('@')) return source.split('@')[0].slice(0, 2).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export function Avatar({ name, email, src, size = 'sm', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const initials = getInitials(name, email)

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-muted text-muted-foreground grid place-items-center', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name || email || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium select-none">{initials}</span>
      )}
    </div>
  )
}

export default Avatar