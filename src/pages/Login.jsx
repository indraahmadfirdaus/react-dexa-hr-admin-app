import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useNotificationStore } from '@/store/notifications'

const DEMO_EMAIL = 'admin@company.com'
const DEMO_PASSWORD = 'password123'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)
  const setNotifyUserId = useNotificationStore((s) => s.setUserId)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const useDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const payload = res?.data?.data
      const user = payload?.user
      const token = payload?.token
      if (!user || !token) throw new Error('Invalid response')

      setToken(token)
      setUser(user)
      if (user?.id) setNotifyUserId(user.id)
      toast.success('Login successful')
      const redirectTo = location?.state?.from?.pathname ?? '/'
      navigate(redirectTo)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-sm relative">
        <div className="grid md:grid-cols-2">
          {/* Left: form */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-1 text-center md:text-left">Sign In</h2>
            <p className="text-sm text-muted-foreground mb-4 text-center md:text-left">Sign in to the admin dashboard.</p>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label className="mb-1 block" htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <div>
                <Label className="mb-1 block" htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    title={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
                <Button type="button" variant="outline" onClick={useDemo}>Use Demo</Button>
              </div>

              <div className="text-xs text-muted-foreground mt-2 text-center md:text-left">
                Demo account: <span className="font-medium">{DEMO_EMAIL}</span> / <span className="font-medium">{DEMO_PASSWORD}</span>
              </div>
            </form>
          </div>

          {/* Right: decorative image panel (centered, not full) */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-500 relative p-8">
            <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-white/15 blur-xl" />
            <div className="absolute -right-10 bottom-8 h-20 w-20 rounded-full bg-black/20 blur-xl" />
            <div className="relative rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 shadow-lg">
              <div className="h-56 w-56 rounded-lg overflow-hidden border border-white/20">
                <img
                  src="https://www.kellerexecutivesearch.com/wp-content/uploads/2022/12/pexels-photo-7176291.jpeg"
                  alt="Corporate workspace"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}