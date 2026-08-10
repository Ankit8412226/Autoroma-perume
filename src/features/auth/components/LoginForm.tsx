'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button, Input, useToast } from '@/components/ui'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/account'
  const { toast } = useToast()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid email or password.')
        toast('Invalid email or password.', 'error')
      } else {
        toast('Welcome back to Aura Véloce.', 'success')
        router.push(nextUrl)
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred.')
      toast('Failed to sign in. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail)
    setPassword(pass)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Bombay Musk Trust Header Showcase */}
      <div className="bg-bg-surface border border-white-500/20 p-4 rounded-sm text-center space-y-3">
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-300 font-semibold block">
          PROUDLY MADE IN INDIA
        </span>
        <h2 className="font-sans text-xl font-bold text-white uppercase tracking-wider">
          OVER 135K+ HAPPY DRIVERS
        </h2>
        <div className="flex items-center justify-center gap-4 text-[10px] font-inter uppercase tracking-widest text-white-300 pt-1 border-t border-white-500/10">
          <span>🇮🇳 MADE IN INDIA</span>
          <span>•</span>
          <span>♻️ RECYCLABLE</span>
          <span>•</span>
          <span>🌱 ECO-FRIENDLY</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1 text-center pt-2">
          <h1 className="font-sans text-2xl text-white font-bold uppercase tracking-wider">
            Sign In
          </h1>
          <p className="text-xs text-white-300 font-inter font-light">
            Sign in to manage your car perfume orders & wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-inter text-center">
            {error}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] uppercase tracking-widest text-white-400 font-inter block text-center">
            ⚡ Quick 1-Click Demo Logins:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('user@auraveloce.com', 'user123')}
              className="py-2 px-3 bg-bg-surface border border-white-500/20 hover:border-white text-xs font-inter text-white font-medium rounded-sm transition-all text-center"
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@auraveloce.com', 'admin123')}
              className="py-2 px-3 bg-bg-surface border border-white-500/20 hover:border-white text-xs font-inter text-white font-medium rounded-sm transition-all text-center"
            >
              👑 Admin Account
            </button>
          </div>
        </div>

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="driver@auraveloce.com"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-white-300 hover:text-white transition-colors uppercase tracking-wider font-inter underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
          className="w-full py-3.5 px-4 font-inter text-xs font-bold uppercase tracking-wider rounded-sm transition-all hover:bg-neutral-200 cursor-pointer border border-white"
        >
          {loading ? 'AUTHENTICATING...' : 'SIGN IN TO YOUR ACCOUNT'}
        </button>

        <div className="text-center text-xs text-white-400 font-inter pt-4 border-t border-white-500/20">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline font-semibold">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  )
}
