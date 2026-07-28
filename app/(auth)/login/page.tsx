import { LoginForm } from '@/features/auth/components/LoginForm'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-white-300 py-12">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  )
}
