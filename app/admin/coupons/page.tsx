import { prisma } from '@/lib/db/prisma'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui'
import type { CouponType } from '@prisma/client'

export const revalidate = 0

interface CouponItem {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderValue: number | null
  usageCount: number
  isActive: boolean
}

export default async function AdminCouponsPage() {
  let coupons: CouponItem[] = []
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        minOrderValue: true,
        usageCount: true,
        isActive: true,
      },
    })
  } catch {
    coupons = []
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white-500/20 pb-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Promotions
        </span>
        <h1 className="font-cormorant text-display-lg text-white-100 font-light">
          Coupons & Discounts
        </h1>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Min Order</th>
                <th className="py-3 px-3">Usage</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-500/10">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white-400">
                    No active coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-3 font-mono font-medium text-gold-200">{c.code}</td>
                    <td className="py-3 px-3 text-white-300">{c.type}</td>
                    <td className="py-3 px-3 text-white-100 font-medium">
                      {c.type === 'PERCENTAGE' ? `${c.value}%` : formatCurrency(c.value)}
                    </td>
                    <td className="py-3 px-3 text-white-300 tabular-nums">
                      {c.minOrderValue ? formatCurrency(c.minOrderValue) : 'None'}
                    </td>
                    <td className="py-3 px-3 text-white-300 tabular-nums">{c.usageCount} times</td>
                    <td className="py-3 px-3">
                      <Badge variant={c.isActive ? 'success' : 'outline'}>
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
