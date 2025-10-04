import React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="outline"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="gap-2"
    >
      {isDark ? (
        <>
          <Sun size={16} />
        </>
      ) : (
        <>
          <Moon size={16} />
        </>
      )}
    </Button>
  )
}