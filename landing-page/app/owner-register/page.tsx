'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { getApiBaseUrl } from '@/utils/api'
import { useOwnerAuth } from '@/stores/auth.store'
import { Eye, EyeOff, UserPlus, Lock, Mail, Phone, User } from 'lucide-react'
import { HouseAndSkyLogo } from '@/components/layout/HouseAndSkyLogo'

const MIN_PASSWORD_LENGTH = 6

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ''))
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/list-your-property'
  const { login, isAuthenticated } = useOwnerAuth()

  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, redirectTo, router])

  const validate = () => {
    const errors: Record<string, string> = {}

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.'
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!phone.trim() || !validatePhone(phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.'
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/register-property-owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password
        })
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.message || 'Could not create account. Please try again.')
        return
      }

      // Auto-login after registration
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

  const inputClass = (field: string) =>
    `w-full bg-[#FAF9F6] border text-brand-charcoal text-xs py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
      fieldErrors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-brand-green/20 focus:border-brand-green focus:ring-brand-green/10'
    }`

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
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green">Property Owner Portal</p>
            <h1 className="font-serif text-3xl font-bold text-brand-charcoal">Create Account</h1>
            <p className="text-xs text-brand-charcoal/60 font-medium">List and manage your properties with House & Sky</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: '' })) }}
                  placeholder="Your full name"
                  className={`${inputClass('fullName')} pl-10 pr-4`}
                />
              </div>
              {fieldErrors.fullName && <p className="text-[11px] text-red-600 font-medium">{fieldErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                  placeholder="you@example.com"
                  className={`${inputClass('email')} pl-10 pr-4`}
                />
              </div>
              {fieldErrors.email && <p className="text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: '' })) }}
                  placeholder="10-digit mobile number"
                  className={`${inputClass('phone')} pl-10 pr-4`}
                />
              </div>
              {fieldErrors.phone && <p className="text-[11px] text-red-600 font-medium">{fieldErrors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                  placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
                  className={`${inputClass('password')} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-charcoal/60"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-[11px] text-red-600 font-medium">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal/70 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })) }}
                  placeholder="Re-enter your password"
                  className={`${inputClass('confirmPassword')} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-charcoal/60"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-[11px] text-red-600 font-medium">{fieldErrors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-brand-green text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating account…' : 'Create Account & Continue'}
            </button>
          </form>

          <div className="pt-2 border-t border-brand-green/10 text-center">
            <p className="text-xs text-brand-charcoal/60">
              Already have an account?{' '}
              <Link
                href={`/owner-login${redirectTo !== '/list-your-property' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-brand-green font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-brand-charcoal/40 mt-4">
          Your account is for listing properties only. It does not grant access to the admin panel.
        </p>
      </div>
    </div>
  )
}

export default function OwnerRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-xs text-brand-charcoal/50">Loading…</p></div>}>
      <RegisterContent />
    </Suspense>
  )
}
