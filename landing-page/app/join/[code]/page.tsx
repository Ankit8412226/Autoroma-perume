'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getApiBaseUrl } from '@/utils/api'
import { UserPlus } from 'lucide-react'

const MIN_PASSWORD_LENGTH = 6

export default function JoinAgentLandingPage() {
  const params = useParams()
  const inviteCode = String(params?.code || '').trim().toUpperCase()
  const [sponsorName, setSponsorName] = React.useState('')
  const [employeeCode, setEmployeeCode] = React.useState('')
  const [isLoadingSponsor, setIsLoadingSponsor] = React.useState(true)
  const [sponsorError, setSponsorError] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  React.useEffect(() => {
    const load = async () => {
      if (!inviteCode) {
        setSponsorError('Invite code is missing.')
        setIsLoadingSponsor(false)
        return
      }
      try {
        const res = await fetch(`${getApiBaseUrl()}/public/agent-invite/${inviteCode}`)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setSponsorError(data.message || 'This invite link is invalid.')
          return
        }
        setSponsorName(data.sponsorName || '')
        setEmployeeCode(data.employeeCode || '')
      } catch {
        setSponsorError('Could not verify this invite link.')
      } finally {
        setIsLoadingSponsor(false)
      }
    }
    load()
  }, [inviteCode])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/public/agent-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password, inviteCode })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message || 'Could not create the account.')
        return
      }
      setSuccess(data.message || 'Account created. Wait for admin approval.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-brand-green/15 shadow-sm p-6 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-green">Agent invite</p>
          <h1 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">Join House & Sky</h1>
          {sponsorName ? (
            <p className="text-sm text-brand-charcoal/70 mt-2">
              You will join under <span className="font-bold text-brand-green">{sponsorName}</span>
              {employeeCode ? ` (${employeeCode})` : ''}
            </p>
          ) : null}
        </div>

        {isLoadingSponsor ? (
          <p className="text-xs text-brand-charcoal/60">Checking invite link…</p>
        ) : sponsorError ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700">{sponsorError}</p>
            <Link href="/" className="text-xs font-bold text-brand-green">Back home</Link>
          </div>
        ) : success ? (
          <p className="text-sm font-semibold text-emerald-800">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Full name</span>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-brand-green" />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-brand-green" />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Phone</span>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-brand-green" />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Password</span>
              <input required type="password" minLength={MIN_PASSWORD_LENGTH} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-brand-green" />
            </label>
            {error ? <p className="text-red-600 font-semibold">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-brand-green text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating account…' : 'Create agent account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
