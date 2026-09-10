import React, { useState, useEffect } from 'react'
import { inquiriesService } from '../services/inquiriesService'
import { TableSkeleton } from '../components/common/Skeleton'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { formatDate } from '../utils/formatters'
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  RefreshCw,
  Inbox
} from 'lucide-react'

export function LeadsInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inquiries, setInquiries] = useState<any[]>([])

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await inquiriesService.getInquiries()
      if (Array.isArray(data)) {
        const formatted = data.map((inq: any) => ({
          id: inq._id ? `INQ-${inq._id.slice(-6).toUpperCase()}` : (inq.id || 'INQ'),
          rawId: inq._id,
          customerName: inq.name || inq.customerName || 'Customer',
          email: inq.email || 'No email provided',
          phone: inq.phone || 'No phone provided',
          project: inq.projectName || (inq.projectId ? inq.projectId.name : 'General Inquiry'),
          plotNo: inq.plotNo || 'N/A',
          type: inq.inquiryType || 'CONTACT_FORM',
          message: inq.message || '',
          assignedAgent: inq.assignedAgentId ? (inq.assignedAgentId.userId ? inq.assignedAgentId.userId.fullName : 'Assigned Agent') : 'Unassigned (Direct Desk)',
          status: inq.status || 'NEW',
          date: formatDate(inq.createdAt, { includeTime: true, fallback: 'Just now' })
        }))
        setInquiries(formatted)
      }
    } catch (e: any) {
      console.error('Inquiries load error', e)
      setError(e?.friendlyMessage || 'Failed to fetch customer inquiries.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (rawId: string, newStatus: string) => {
    try {
      await inquiriesService.updateInquiryStatus(rawId, { status: newStatus })
      fetchInquiries()
    } catch (e: any) {
      console.error('Failed to update status', e)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#171A18]">Customer Contact & Plot Inquiries</h1>
          <p className="text-xs text-[#171A18]/70">Central CRM inbox for landing page contacts, site tour requests & price inquiries</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInquiries}
            className="p-2 text-[#0B4F3C] bg-[#EAF3EF] border border-[#0B4F3C]/20 rounded-xl hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3.5 py-1.5 bg-[#0B4F3C] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> {inquiries.length} Active Leads
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#0B4F3C]/15 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#171A18]/50" />
          <input
            type="text"
            placeholder="Search by customer name, email, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0B4F3C]" />
          <span className="text-xs font-bold text-[#171A18]/70">Status:</span>
          {['ALL', 'NEW', 'IN_PROGRESS', 'CONVERTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B4F3C] text-white border-[#0B4F3C]'
                  : 'bg-[#FAF9F6] text-[#0B4F3C] border-[#0B4F3C]/20 hover:bg-[#EAF3EF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={7} />
      ) : error ? (
        <ErrorState title="Inquiries Load Failed" message={error} onRetry={fetchInquiries} />
      ) : filteredInquiries.length === 0 ? (
        <EmptyState
          title="No Customer Leads Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'No customer inquiries match your active filter criteria.'
              : 'No leads or inquiries have been received yet from the landing page.'
          }
          icon={Inbox}
        />
      ) : (
        <div className="bg-white border border-[#0B4F3C]/15 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#0B4F3C]/15 text-[#0B4F3C] font-bold uppercase text-[10px] bg-[#EAF3EF]">
                  <th className="py-3.5 px-4">Lead ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Target Land Plot</th>
                  <th className="py-3.5 px-4">Inquiry Type</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B4F3C]/10">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#EAF3EF]/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#0B4F3C]">{inq.id}</td>
                    <td className="py-4 px-4 space-y-0.5">
                      <h4 className="font-bold text-[#171A18] text-sm">{inq.customerName}</h4>
                      <p className="text-[11px] text-[#171A18]/70 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#0B4F3C]" /> {inq.email}
                      </p>
                      <p className="text-[11px] text-[#171A18]/70 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#0B4F3C]" /> {inq.phone}
                      </p>
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <span className="font-bold text-[#171A18] block">{inq.project}</span>
                      <span className="px-2 py-0.5 bg-[#EAF3EF] text-[#0B4F3C] text-[10px] font-bold rounded border border-[#0B4F3C]/20 inline-block">
                        Plot: {inq.plotNo}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#0B4F3C]/20 font-bold text-[10px] text-[#0B4F3C]">
                        {inq.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-xs text-[#171A18]/80">{inq.assignedAgent}</td>
                    <td className="py-4 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => inq.rawId && handleStatusChange(inq.rawId, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none ${
                          inq.status === 'NEW'
                            ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                            : inq.status === 'IN_PROGRESS'
                            ? 'bg-sky-500/20 text-sky-800 border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-[#171A18]/70">{inq.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
export default LeadsInquiriesPage
