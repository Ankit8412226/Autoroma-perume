import { prisma } from '@/lib/db/prisma'
import { Badge } from '@/components/ui'

export const revalidate = 0

interface InquiryItem {
  id: string
  referenceNumber: string
  businessType: string
  companyName: string
  contactName: string
  phone: string
  estimatedQty: number
  status: string
}

export default async function AdminBulkOrdersPage() {
  let inquiries: InquiryItem[] = []
  try {
    inquiries = await prisma.bulkOrder.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceNumber: true,
        businessType: true,
        companyName: true,
        contactName: true,
        phone: true,
        estimatedQty: true,
        status: true,
      },
    })
  } catch {
    inquiries = []
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white-500/20 pb-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Corporate & Fleet
        </span>
        <h1 className="font-cormorant text-display-lg text-white-100 font-light">
          B2B Inquiries Inbox
        </h1>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead className="border-b border-white-500/20 text-white-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Ref #</th>
                <th className="py-3 px-3">Business Type</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Est. Qty</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-500/10">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white-400">
                    No B2B inquiries received yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-bg-elevated/50">
                    <td className="py-3 px-3 font-mono text-gold-200">{inq.referenceNumber}</td>
                    <td className="py-3 px-3 text-white-300">{inq.businessType}</td>
                    <td className="py-3 px-3 font-medium text-white-100">{inq.companyName}</td>
                    <td className="py-3 px-3 text-white-200">
                      {inq.contactName} ({inq.phone})
                    </td>
                    <td className="py-3 px-3 font-medium text-white-100 tabular-nums">
                      {inq.estimatedQty} units
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={inq.status === 'NEW' ? 'gold' : 'surface'}>
                        {inq.status}
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
