import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password | Aura Véloce',
  description: 'Reset your password for your Aura Véloce luxury car perfume account.',
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-white-300 py-12">Loading portal...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
