import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button, Badge } from '@/components/ui'
import { Plus } from 'lucide-react'
import type { ProductType, ProductStatus } from '@prisma/client'

export const revalidate = 0

interface ProductAdminItem {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  productType: ProductType
  status: ProductStatus
}

export default async function AdminProductsPage() {
  let products: ProductAdminItem[] = []
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        productType: true,
        status: true,
      },
    })
  } catch {
    products = []
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white-500/20 pb-6">
        <div>
          <span className="text-label text-gold-300 uppercase tracking-widest block">
            Inventory Management
          </span>
          <h1 className="font-cormorant text-display-lg text-white-100 font-light">
            Products Catalog
          </h1>
        </div>
        <Button variant="primary" size="sm">
          <Link href="/admin/products/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add New Fragrance</span>
          </Link>
        </Button>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-500/10">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white-400">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-3 font-medium text-white-100">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-white-400">{p.sku}</td>
                    <td className="py-3 px-3 text-gold-300">{p.productType.replace('_', ' ')}</td>
                    <td className="py-3 px-3 font-medium text-gold-200 tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-3 text-white-200 tabular-nums">{p.stock} units</td>
                    <td className="py-3 px-3">
                      <Badge variant={p.status === 'ACTIVE' ? 'success' : 'outline'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="text-gold-300 hover:underline">
                        Edit
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
