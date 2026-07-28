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
        toast('Welcome back.', 'success')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Client Portal
        </span>
        <h1 className="font-cormorant text-heading-xl text-white-100 font-light">
          Sign In
        </h1>
      </div>

      {error && (
        <div className="p-3 border border-error/50 bg-error/10 text-error text-xs font-inter text-center">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="driver@domain.com"
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
          className="text-xs text-gold-300 hover:text-gold-200 transition-colors uppercase tracking-wider font-inter"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
        Sign In
      </Button>

      <div className="text-center text-xs text-white-400 font-inter pt-4 border-t border-white-500/20">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-gold-300 hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  )
}
