'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, useToast } from '@/components/ui'
import { requestPasswordReset } from '../actions/request-password-reset'

export function ForgotPasswordForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [devToken, setDevToken] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDevToken(null)

    try {
      const res = await requestPasswordReset({ email })

      if (!res.success) {
        const errorMsg = typeof res.error === 'string' ? res.error : res.error.message
        setError(errorMsg)
        toast(errorMsg, 'error')
      } else {
        setSubmitted(true)
        if (res.data.devResetToken) {
          setDevToken(res.data.devResetToken)
        }
        toast('Password reset link requested.', 'success')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      toast('Failed to request password reset.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Brand Trust Header Showcase */}
      <div className="bg-bg-surface border border-white-500/20 p-4 rounded-sm text-center space-y-3">
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-300 font-semibold block">
          AURA VÉLOCE SUPPORT
        </span>
        <h2 className="font-sans text-xl font-bold text-white uppercase tracking-wider">
          ACCOUNT ACCESS RECOVERY
        </h2>
        <div className="flex items-center justify-center gap-4 text-[10px] font-inter uppercase tracking-widest text-white-300 pt-1 border-t border-white-500/10">
          <span>🔒 SECURE 256-BIT</span>
          <span>•</span>
          <span>⚡ INSTANT RESET</span>
        </div>
      </div>

      {submitted ? (
        <div className="space-y-6 text-center py-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="font-sans text-2xl text-white font-bold uppercase tracking-wider">
              Check Your Email
            </h1>
            <p className="text-xs text-white-300 font-inter font-light max-w-sm mx-auto leading-relaxed">
              If an account is associated with <span className="text-white font-medium">{email}</span>, you will receive an email with instructions to reset your password shortly.
            </p>
          </div>

          {devToken && (
            <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-sm text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block font-inter">
                ⚡ Developer 1-Click Reset Link:
              </span>
              <p className="text-[11px] text-amber-200/80 font-mono break-all">
                Token: {devToken}
              </p>
              <button
                type="button"
                onClick={() => router.push(`/reset-password?token=${devToken}`)}
                className="w-full mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase font-inter rounded-sm transition-all text-center"
              >
                Proceed to Reset Password Screen →
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-white-500/20 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setEmail('')
              }}
              className="text-xs text-white-300 hover:text-white font-inter tracking-wider uppercase underline"
            >
              Try another email address
            </button>

            <Link
              href="/login"
              className="text-xs text-white hover:underline font-semibold font-inter uppercase tracking-wider"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 text-center pt-2">
            <h1 className="font-sans text-2xl text-white font-bold uppercase tracking-wider">
              Forgot Password?
            </h1>
            <p className="text-xs text-white-300 font-inter font-light">
              Enter your email address and we&apos;ll send you a password reset link.
            </p>
          </div>

          {error && (
            <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-inter text-center">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="driver@auraveloce.com"
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
            className="w-full py-3.5 px-4 font-inter text-xs font-bold uppercase tracking-wider rounded-sm transition-all hover:bg-neutral-200 cursor-pointer border border-white disabled:opacity-50"
          >
            {loading ? 'SENDING INSTRUCTIONS...' : 'SEND RESET LINK'}
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
