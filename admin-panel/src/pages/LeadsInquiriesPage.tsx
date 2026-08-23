import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Plus
} from 'lucide-react'

export function LeadsInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const [inquiries, setInquiries] = useState([
    {
      id: 'inq-101',
      customerName: 'Rajesh Singhania',
      email: 'rajesh.s@singhaniagroup.in',
      phone: '+91 98201 99887',
      project: 'The Solitaire Sky Villa Enclave',
      plotNo: 'Plot E5-104',
      type: 'SITE_VISIT_REQUEST',
      message: 'Interested in booking a private site tour for Plot E5-104 this weekend with senior estate advisor.',
      assignedAgent: 'Kabir Merchant (EMP-1001)',
      status: 'NEW',
      date: 'Aug 23, 2026 at 11:30 AM',
    },
    {
      id: 'inq-102',
      customerName: 'Ananya Deshmukh',
      email: 'ananya.d@deshmukhhomes.com',
      phone: '+91 98190 22334',
      project: 'Casa de Assagao Coastal Enclave',
      plotNo: 'Plot GA-208',
      type: 'PRICE_QUOTATION',
      message: 'Requesting formal PLC breakdown & milestone payment options for coastal land plot GA-208.',
      assignedAgent: 'Unassigned (Direct Desk)',
      status: 'IN_PROGRESS',
      date: 'Aug 22, 2026 at 04:15 PM',
    },
    {
      id: 'inq-103',
      customerName: 'Devendra Kapoor',
      email: 'd.kapoor@kapoorcapital.com',
      phone: '+91 98700 44556',
      project: 'Golf Course Credenza Enclave',
      plotNo: 'Plot GC-54',
      type: 'CONTACT_FORM_SUBMISSION',
      message: 'Looking for 450 Sq Yrd prime land plots on Golf Course Road for commercial villa development.',
      assignedAgent: 'Natasha Roy (EMP-1004)',
      status: 'CONVERTED',
      date: 'Aug 20, 2026 at 02:45 PM',
    },
  ])

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/reports')
      if (res.ok) {
        const data = await res.json()
        if (data.inquiries && data.inquiries.length > 0) {
          setInquiries(data.inquiries)
        }
      }
    } catch (e) {
      console.log('Inquiries sync fallback', e)
    } finally {
      setIsLoading(false)
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
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
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
                      {inq.plotNo}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#0B4F3C]/20 font-bold text-[10px] text-[#0B4F3C]">
                      {inq.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-xs text-[#171A18]/80">{inq.assignedAgent}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        inq.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                          : inq.status === 'IN_PROGRESS'
                          ? 'bg-sky-500/20 text-sky-800 border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#171A18]/70">{inq.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default LeadsInquiriesPage
