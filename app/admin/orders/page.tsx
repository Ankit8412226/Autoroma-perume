import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui'

export const revalidate = 0

interface OrderItemAdmin {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: Date
}

export default async function AdminOrdersPage() {
  let orders: OrderItemAdmin[] = []
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    })
  } catch {
    orders = []
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white-500/20 pb-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Sales & Fulfillment
        </span>
        <h1 className="font-cormorant text-display-lg text-white-100 font-light">
          Order Management
        </h1>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Order Number</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-500/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-3 font-medium text-white-100">{o.orderNumber}</td>
                    <td className="py-3 px-3 text-white-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-3 font-medium text-gold-200 tabular-nums">{formatCurrency(o.total)}</td>
                    <td className="py-3 px-3">
                      <Badge variant={o.paymentStatus === 'PAID' ? 'success' : 'outline'}>
                        {o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={o.status === 'CONFIRMED' ? 'gold' : 'surface'}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/orders/${o.id}`} className="text-gold-300 hover:underline">
                        Manage
                      </Link>
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
