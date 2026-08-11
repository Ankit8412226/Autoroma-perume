import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check for session cookie presence
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  const isAuthenticated = Boolean(sessionToken)

  // Protected customer routes
  if (pathname.startsWith('/account') || pathname === '/checkout' || pathname === '/wishlist') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url))
    }
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login?next=/admin', req.url))
    }
  }

  // Auth pages redirect logged-in users away
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  ) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/account', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/wishlist',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}
