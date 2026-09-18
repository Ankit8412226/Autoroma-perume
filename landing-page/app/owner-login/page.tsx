'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { getApiBaseUrl } from '@/utils/api'
import { useOwnerAuth } from '@/stores/auth.store'
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react'
import { HouseAndSkyLogo } from '@/components/layout/HouseAndSkyLogo'


function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/my-properties'
  const { login, isAuthenticated } = useOwnerAuth()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, redirectTo, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailTrimmed = email.trim().toLowerCase()
    if (!emailTrimmed || !password) {
      setError('Email and password are required.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed, password })
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      if (!data.token || !data.user) {
        setError('Login failed. Please try again.')
        return
      }

      // Only allow PROPERTY_OWNER role to login via this portal
      if (data.user.role !== 'PROPERTY_OWNER') {
        setError('This portal is for property owners only. Admin/staff should use the admin panel.')
        return
      }

      login(data.token, {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role
      })

      router.replace(redirectTo)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-bg-primary">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <HouseAndSkyLogo variant="dark" showTagline size="md" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-brand-green/15 shadow-sm p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green">Property Owner Portal</p>
            <h1 className="font-serif text-3xl font-bold text-brand-charcoal">Welcome back</h1>
            <p className="text-xs text-brand-charcoal/60 font-medium">Login to manage your property listings</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 text-brand-charcoal text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 text-brand-charcoal text-xs pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-charcoal/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-brand-green text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Logging in…' : 'Login to my account'}
            </button>
          </form>

          {/* Footer links */}
          <div className="pt-2 border-t border-brand-green/10 text-center space-y-2">
            <p className="text-xs text-brand-charcoal/60">
              Don't have an account?{' '}
              <Link
                href={`/owner-register${redirectTo !== '/my-properties' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-brand-green font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OwnerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-xs text-brand-charcoal/50">Loading…</p></div>}>
      <LoginContent />
    </Suspense>
  )
}
