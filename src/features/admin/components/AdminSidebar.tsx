'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Inbox,
  Tag,
  Star,
  Settings,
  ArrowLeft,
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/bulk-orders', label: 'B2B Inquiries', icon: Inbox },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-bg-secondary border-r border-white-500/20 flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-white-500/20">
        <span className="font-cormorant text-xl text-white-100 uppercase tracking-widest block font-light">
          Maison Noir
        </span>
        <span className="text-[10px] uppercase tracking-widest text-gold-300 font-inter">
          Admin Atelier
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 font-inter text-xs uppercase tracking-wider">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors rounded-none',
                isActive
                  ? 'bg-gold-300/15 text-gold-200 border-l-2 border-gold-300 font-medium'
                  : 'text-white-300 hover:text-white-100 hover:bg-bg-surface'
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-gold-300" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Back to Boutique Store Link */}
      <div className="p-4 border-t border-white-500/20">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white-400 hover:text-gold-300 transition-colors px-4 py-2 font-inter uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Store</span>
        </Link>
      </div>
    </aside>
  )
}
