'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, useToast } from '@/components/ui'
import { register } from '../actions/register'

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await register({ name, email, password, confirmPassword })

      if (!res.success) {
        const errorMsg = typeof res.error === 'string' ? res.error : res.error.message
        setError(errorMsg)
        toast(errorMsg, 'error')
      } else {
        toast('Account created successfully. Please sign in.', 'success')
        router.push('/login')
      }
    } catch {
      setError('Failed to create account.')
      toast('Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          New Membership
        </span>
        <h1 className="font-cormorant text-heading-xl text-white-100 font-light">
          Create Account
        </h1>
      </div>

      {error && (
        <div className="p-3 border border-error/50 bg-error/10 text-error text-xs font-inter text-center">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Arjun Mehta"
      />

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
        helperText="Must be 8+ chars with uppercase, number & special char"
        placeholder="••••••••"
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="••••••••"
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
        Register Account
      </Button>

      <div className="text-center text-xs text-white-400 font-inter pt-4 border-t border-white-500/20">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-300 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  )
}
