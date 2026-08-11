'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input, useToast } from '@/components/ui'
import { resetPassword } from '../actions/reset-password'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const { toast } = useToast()

  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  // Live password requirement validation checks
  const checks = React.useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    }
  }, [password])

  const allChecksPassed = React.useMemo(() => {
    return Object.values(checks).every(Boolean)
  }, [checks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (!allChecksPassed) {
      setError('Password does not meet all security requirements.')
      setLoading(false)
      return
    }

    try {
      const res = await resetPassword({ token, password, confirmPassword })

      if (!res.success) {
        const errorMsg = typeof res.error === 'string' ? res.error : res.error.message
        setError(errorMsg)
        toast(errorMsg, 'error')
      } else {
        setSuccess(true)
        toast('Password reset successful! Please sign in.', 'success')
      }
    } catch {
      setError('An unexpected error occurred while resetting your password.')
      toast('Failed to reset password. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !success) {
    return (
      <div className="space-y-6 w-full text-center py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h1 className="font-sans text-xl text-white font-bold uppercase tracking-wider">
            Missing Reset Token
          </h1>
          <p className="text-xs text-white-300 font-inter font-light max-w-xs mx-auto">
            The password reset link appears to be incomplete or invalid.
          </p>
        </div>
        <div className="pt-4 border-t border-white-500/20">
          <Link
            href="/forgot-password"
            className="inline-block py-2.5 px-6 bg-white text-black text-xs font-bold uppercase font-inter rounded-sm hover:bg-neutral-200 transition-all"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Brand Header Showcase */}
      <div className="bg-bg-surface border border-white-500/20 p-4 rounded-sm text-center space-y-3">
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-300 font-semibold block">
          AURA VÉLOCE SECURITY
        </span>
        <h2 className="font-sans text-xl font-bold text-white uppercase tracking-wider">
          CREATE NEW PASSWORD
        </h2>
        <div className="flex items-center justify-center gap-4 text-[10px] font-inter uppercase tracking-widest text-white-300 pt-1 border-t border-white-500/10">
          <span>🔒 ENCRYPTED HASH</span>
          <span>•</span>
          <span>🛡️ AUTO SESSION CLEAR</span>
        </div>
      </div>

      {success ? (
        <div className="space-y-6 text-center py-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="font-sans text-2xl text-white font-bold uppercase tracking-wider">
              Password Reset Complete
            </h1>
            <p className="text-xs text-white-300 font-inter font-light max-w-sm mx-auto leading-relaxed">
              Your password has been successfully updated. You can now sign in to your Aura Véloce account using your new password.
            </p>
          </div>

          <div className="pt-4 border-t border-white-500/20">
            <button
              type="button"
              onClick={() => router.push('/login')}
              style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              className="w-full py-3.5 px-4 font-inter text-xs font-bold uppercase tracking-wider rounded-sm transition-all hover:bg-neutral-200 cursor-pointer border border-white"
            >
              Sign In to Your Account →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 text-center pt-2">
            <h1 className="font-sans text-2xl text-white font-bold uppercase tracking-wider">
              Reset Password
            </h1>
            <p className="text-xs text-white-300 font-inter font-light">
              Enter your new secure password below.
            </p>
          </div>

          {error && (
            <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-inter text-center">
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          {/* Password Requirements Checklist */}
          <div className="p-3 bg-bg-surface border border-white-500/15 rounded-sm space-y-1.5 font-inter text-[11px]">
            <span className="text-white-400 font-medium uppercase text-[10px] tracking-wider block mb-1">
              Password Requirements:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className={`flex items-center gap-1.5 ${checks.minLength ? 'text-emerald-400' : 'text-white-400'}`}>
                <span>{checks.minLength ? '✓' : '•'}</span> 8+ Characters
              </div>
              <div className={`flex items-center gap-1.5 ${checks.hasUpper ? 'text-emerald-400' : 'text-white-400'}`}>
                <span>{checks.hasUpper ? '✓' : '•'}</span> Uppercase Letter
              </div>
              <div className={`flex items-center gap-1.5 ${checks.hasNumber ? 'text-emerald-400' : 'text-white-400'}`}>
                <span>{checks.hasNumber ? '✓' : '•'}</span> Number (0-9)
              </div>
              <div className={`flex items-center gap-1.5 ${checks.hasSpecial ? 'text-emerald-400' : 'text-white-400'}`}>
                <span>{checks.hasSpecial ? '✓' : '•'}</span> Special Symbol
              </div>
            </div>
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
            className="w-full py-3.5 px-4 font-inter text-xs font-bold uppercase tracking-wider rounded-sm transition-all hover:bg-neutral-200 cursor-pointer border border-white disabled:opacity-50"
          >
            {loading ? 'RESETTING PASSWORD...' : 'UPDATE PASSWORD'}
          </button>

          <div className="text-center text-xs text-white-400 font-inter pt-4 border-t border-white-500/20">
            Remembered your password?{' '}
            <Link href="/login" className="text-white hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
