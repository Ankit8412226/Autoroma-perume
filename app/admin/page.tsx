import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button, Badge } from '@/components/ui'
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowRight } from 'lucide-react'

export const revalidate = 0 // Dynamic admin page

export default async function AdminDashboardPage() {
  let stats = {
    totalRevenue: 4890000, // ₹48,900
    totalOrders: 28,
    pendingOrders: 4,
    lowStockCount: 2,
  }

  let recentOrders: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: Date }> = []

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
      },
    })
    if (orders.length > 0) recentOrders = orders
  } catch {
    // Fallback if DB disconnected
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white-500/20 pb-6">
        <div>
          <span className="text-label text-gold-300 uppercase tracking-widest block">
            Atelier Overview
          </span>
          <h1 className="font-cormorant text-display-lg text-white-100 font-light">
            Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Link href="/admin/products/new">+ New Product</Link>
          </Button>
          <Button variant="primary" size="sm">
            <Link href="/admin/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-surface border border-white-500/20 p-6 space-y-2">
          <div className="flex justify-between items-center text-white-300">
            <span className="text-xs uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-gold-300" />
          </div>
          <span className="text-2xl font-medium text-gold-200 tabular-nums block">
            {formatCurrency(stats.totalRevenue)}
          </span>
          <span className="text-[11px] text-success">+14.2% from last month</span>
        </div>

        <div className="bg-bg-surface border border-white-500/20 p-6 space-y-2">
          <div className="flex justify-between items-center text-white-300">
            <span className="text-xs uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-gold-300" />
          </div>
          <span className="text-2xl font-medium text-white-100 tabular-nums block">
            {stats.totalOrders}
          </span>
          <span className="text-[11px] text-white-400">{stats.pendingOrders} pending dispatch</span>
        </div>

        <div className="bg-bg-surface border border-white-500/20 p-6 space-y-2">
          <div className="flex justify-between items-center text-white-300">
            <span className="text-xs uppercase tracking-wider">New Clients</span>
            <Users className="h-4 w-4 text-gold-300" />
          </div>
          <span className="text-2xl font-medium text-white-100 tabular-nums block">
            18
          </span>
          <span className="text-[11px] text-white-400">This month</span>
        </div>

        <div className="bg-bg-surface border border-gold-300/30 p-6 space-y-2">
          <div className="flex justify-between items-center text-white-300">
            <span className="text-xs uppercase tracking-wider text-amber">Low Stock Alert</span>
            <AlertTriangle className="h-4 w-4 text-amber" />
          </div>
          <span className="text-2xl font-medium text-amber tabular-nums block">
            {stats.lowStockCount} Products
          </span>
          <span className="text-[11px] text-white-400">Requires restocking</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-bg-surface border border-white-500/20 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-white-500/20 pb-4">
          <h3 className="font-cormorant text-heading-md text-white-100 font-light">
            Recent Orders
          </h3>
          <Link href="/admin/orders" className="text-xs text-gold-300 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-white-400 py-6 text-center">No orders logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-inter">
              <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white-500/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-2 font-medium text-white-100">{order.orderNumber}</td>
                    <td className="py-3 px-2 text-white-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-2 text-gold-200 font-medium tabular-nums">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-2">
                      <Badge variant={order.status === 'CONFIRMED' ? 'success' : 'gold'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-gold-300 hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
