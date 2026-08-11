import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | Aura Véloce',
  description: 'Set a new secure password for your Aura Véloce account.',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-white-300 py-12">Loading portal...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
