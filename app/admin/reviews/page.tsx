import { prisma } from '@/lib/db/prisma'
import { Badge } from '@/components/ui'

export const revalidate = 0

interface ReviewAdminItem {
  id: string
  rating: number
  title: string
  body: string
  status: string
  product: { name: string } | null
  user: { name: string | null; email: string } | null
}

export default async function AdminReviewsPage() {
  let reviews: ReviewAdminItem[] = []
  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        status: true,
        product: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    })
  } catch {
    reviews = []
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white-500/20 pb-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Client Feedback
        </span>
        <h1 className="font-cormorant text-display-lg text-white-100 font-light">
          Review Moderation Queue
        </h1>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Title & Review</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-500/10">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white-400">
                    No reviews in queue.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-3 font-medium text-white-100">{r.product?.name}</td>
                    <td className="py-3 px-3 text-gold-300">★ {r.rating}</td>
                    <td className="py-3 px-3 max-w-xs">
                      <strong className="text-white-100 block">{r.title}</strong>
                      <span className="text-white-400 truncate block">{r.body}</span>
                    </td>
                    <td className="py-3 px-3 text-white-300">{r.user?.name || r.user?.email}</td>
                    <td className="py-3 px-3">
                      <Badge variant={r.status === 'APPROVED' ? 'success' : 'gold'}>
                        {r.status}
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
