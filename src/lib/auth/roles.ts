import type { Session } from 'next-auth'
import { UserRole } from '@prisma/client'

export function isAdmin(session: Session | null): boolean {
  return (
    session?.user?.role === UserRole.ADMIN ||
    session?.user?.role === UserRole.SUPER_ADMIN
  )
}

export function isSuperAdmin(session: Session | null): boolean {
  return session?.user?.role === UserRole.SUPER_ADMIN
}

export function isCustomer(session: Session | null): boolean {
  return session?.user?.role === UserRole.CUSTOMER
}

export function requireAuth(session: Session | null): asserts session is Session {
  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }
}

export function requireAdmin(session: Session | null): asserts session is Session {
  if (!isAdmin(session)) {
    throw new Error('FORBIDDEN')
  }
}
